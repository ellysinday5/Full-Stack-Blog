"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";

const schema = z.object({
	authorName: z.string().min(1, "Name is required").max(80, "Name is too long"),
	body: z
		.string()
		.min(10, "Comment must be at least 10 characters")
		.max(2000, "Comment is too long"),
	postId: z.string().uuid(),
	slug: z.string().min(1),
});

type FormState = {
	success?: boolean;
	errors?: {
		authorName?: string;
		body?: string;
	};
};

export async function addComment(
	_prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	const parsed = schema.safeParse({
		authorName: formData.get("authorName"),
		body: formData.get("body"),
		postId: formData.get("postId"),
		slug: formData.get("slug"),
	});

	if (!parsed.success) {
		const fieldErrors = parsed.error.flatten().fieldErrors;
		return {
			errors: {
				authorName: fieldErrors.authorName?.[0],
				body: fieldErrors.body?.[0],
			},
		};
	}

	const { authorName, body, postId, slug } = parsed.data;

	await db.insert(comments).values({ authorName, body, postId });

	revalidatePath(`/blog/${slug}`);

	return { success: true };
}
