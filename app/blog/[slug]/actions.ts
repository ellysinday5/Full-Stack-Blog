"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";

const schema = z.object({
	authorName: z.string().min(1, "Name is required").max(80, "Name is too long"),
	email: z.string().email("Invalid email address"),
	website: z.string().url("Invalid URL").optional().or(z.literal("")),
	isAnonymous: z.boolean(),
	body: z
		.string()
		.min(1, "Comment is required")
		.max(2000, "Comment is too long"),
	postId: z.string().uuid(),
	slug: z.string().min(1),
});

type FormState = {
	success?: boolean;
	errors?: {
		authorName?: string;
		email?: string;
		website?: string;
		body?: string;
	};
};

export async function addComment(
	_prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	const parsed = schema.safeParse({
		authorName: formData.get("authorName"),
		email: formData.get("email"),
		website: formData.get("website") || "",
		isAnonymous: formData.get("isAnonymous") === "on",
		body: formData.get("body"),
		postId: formData.get("postId"),
		slug: formData.get("slug"),
	});

	if (!parsed.success) {
		const fieldErrors = parsed.error.flatten().fieldErrors;
		return {
			errors: {
				authorName: fieldErrors.authorName?.[0],
				email: fieldErrors.email?.[0],
				website: fieldErrors.website?.[0],
				body: fieldErrors.body?.[0],
			},
		};
	}

	const { authorName, email, website, isAnonymous, body, postId, slug } =
		parsed.data;

	await db.insert(comments).values({
		authorName,
		email,
		website: website || null,
		isAnonymous,
		body,
		postId,
	});

	revalidatePath(`/blog/${slug}`);

	return { success: true };
}
