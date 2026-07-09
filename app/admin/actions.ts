"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

const schema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200, "Slug is too long")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase letters, numbers, and hyphens only",
		),
	body: z.string().min(1, "Body is required"),
	tags: z.string().optional(), // comma-separated list e.g. "tech, nextjs"
	password: z.string().min(1, "Password is required"),
});

export type CreatePostState = {
	errors?: {
		title?: string;
		slug?: string;
		body?: string;
		tags?: string;
		password?: string;
	};
};

export async function createPost(
	_prevState: CreatePostState,
	formData: FormData,
): Promise<CreatePostState> {
	const parsed = schema.safeParse({
		title: formData.get("title"),
		slug: formData.get("slug"),
		body: formData.get("body"),
		tags: formData.get("tags") || "",
		password: formData.get("password"),
	});

	if (!parsed.success) {
		const fieldErrors = parsed.error.flatten().fieldErrors;
		return {
			errors: {
				title: fieldErrors.title?.[0],
				slug: fieldErrors.slug?.[0],
				body: fieldErrors.body?.[0],
				tags: fieldErrors.tags?.[0],
				password: fieldErrors.password?.[0],
			},
		};
	}

	const { title, slug, body, tags, password } = parsed.data;

	if (password !== process.env.ADMIN_PASSWORD) {
		return { errors: { password: "Incorrect admin password" } };
	}

	// Parse comma-separated tags into a trimmed array, filtering empty strings
	const tagsArray = tags
		? tags
				.split(",")
				.map((t) => t.trim().toLowerCase())
				.filter(Boolean)
		: [];

	await db.insert(posts).values({ title, slug, body, tags: tagsArray });

	revalidatePath("/blog");
	revalidatePath(`/blog/${slug}`);

	redirect(`/blog/${slug}`);
}
