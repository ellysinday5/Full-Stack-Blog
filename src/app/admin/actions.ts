"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";

async function requireAdmin() {
	const cookieStore = await cookies();
	const session = cookieStore.get("admin_session");
	const loggedOut = cookieStore.get("admin_logged_out");
	if (loggedOut?.value === "1" || session?.value !== "authenticated") {
		throw new Error("Unauthorized access. Session expired or logged out.");
	}
}

// ── Create Post ───────────────────────────────────────────────────────────────

const createSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200, "Slug is too long")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase letters, numbers, and hyphens only",
		),
	body: z.string().min(1, "Content is required"),
	categoryId: z.string().min(1, "Category is required"),
	status: z.enum(["published", "draft"]).default("published"),
});

export type CreatePostState = {
	errors?: {
		title?: string;
		slug?: string;
		body?: string;
		categoryId?: string;
	};
};

export async function createPost(
	_prevState: CreatePostState,
	formData: FormData,
): Promise<CreatePostState> {
	await requireAdmin();
	const parsed = createSchema.safeParse({
		title: formData.get("title"),
		slug: formData.get("slug"),
		body: formData.get("body"),
		categoryId: formData.get("categoryId") || "",
		status: formData.get("status") || "published",
	});

	if (!parsed.success) {
		const fieldErrors = parsed.error.flatten().fieldErrors;
		return {
			errors: {
				title: fieldErrors.title?.[0],
				slug: fieldErrors.slug?.[0],
				body: fieldErrors.body?.[0],
				categoryId: fieldErrors.categoryId?.[0],
			},
		};
	}

	const { title, slug, body, categoryId, status } = parsed.data;

	const coverPhoto = formData.get("coverPhoto") as File | null;
	let coverImage: string | null = null;
	if (coverPhoto && coverPhoto.size > 0) {
		const { url } = await put(
			`articles/${Date.now()}-${coverPhoto.name}`,
			coverPhoto,
			{ access: "public" },
		);
		coverImage = url;
	}

	await db.insert(posts).values({
		title,
		slug,
		body,
		tags: [],
		status,
		categoryId: categoryId || null,
		coverImage,
	});

	revalidatePath("/blog");
	revalidatePath(`/blog/${slug}`);
	revalidatePath("/admin");
	revalidatePath("/admin/posts");

	if (status === "published") {
		redirect("/admin/posts");
	}
	redirect("/admin?tab=drafts");
}

// ── Update Post ───────────────────────────────────────────────────────────────

export async function updatePost(
	_prevState: CreatePostState,
	formData: FormData,
): Promise<CreatePostState> {
	await requireAdmin();
	const parsed = createSchema.safeParse({
		title: formData.get("title"),
		slug: formData.get("slug"),
		body: formData.get("body"),
		categoryId: formData.get("categoryId") || "",
		status: formData.get("status") || "published",
	});

	if (!parsed.success) {
		const fieldErrors = parsed.error.flatten().fieldErrors;
		return {
			errors: {
				title: fieldErrors.title?.[0],
				slug: fieldErrors.slug?.[0],
				body: fieldErrors.body?.[0],
				categoryId: fieldErrors.categoryId?.[0],
			},
		};
	}

	const postId = formData.get("postId") as string;
	if (!postId) {
		return { errors: { body: "Missing post ID for update." } };
	}

	// Only draft posts can be edited — server-side enforcement
	const existing = await db.query.posts.findFirst({
		where: eq(posts.id, postId),
		columns: { status: true },
	});
	if (!existing || existing.status !== "draft") {
		return {
			errors: { body: "Only draft posts can be edited. Published and archived posts are locked." },
		};
	}

	const { title, slug, body, categoryId, status } = parsed.data;

	const coverPhoto = formData.get("coverPhoto") as File | null;
	let coverImage: string | undefined;
	if (coverPhoto && coverPhoto.size > 0) {
		const { url } = await put(
			`articles/${Date.now()}-${coverPhoto.name}`,
			coverPhoto,
			{ access: "public" },
		);
		coverImage = url;
	}

	const updateData: any = {
		title,
		slug,
		body,
		tags: [],
		status,
		categoryId: categoryId || null,
	};
	if (coverImage) updateData.coverImage = coverImage;

	await db.update(posts).set(updateData).where(eq(posts.id, postId));

	revalidatePath("/blog");
	revalidatePath(`/blog/${slug}`);
	revalidatePath("/admin");
	revalidatePath("/admin/posts");

	if (status === "published") {
		redirect("/admin/posts");
	}
	redirect("/admin?tab=drafts");
}

// ── Post Status ───────────────────────────────────────────────────────────────

export type PostStatus = "published" | "draft" | "archived";

export type UpdatePostStatusState = {
	success?: boolean;
	error?: string;
};

export async function updatePostStatus(
	_prevState: UpdatePostStatusState,
	formData: FormData,
): Promise<UpdatePostStatusState> {
	await requireAdmin();
	const postId = formData.get("postId") as string;
	const status = formData.get("status") as PostStatus;

	if (!postId || !["published", "draft", "archived"].includes(status)) {
		return { error: "Invalid request." };
	}

	await db.update(posts).set({ status }).where(eq(posts.id, postId));

	revalidatePath("/blog");
	revalidatePath("/admin");
	revalidatePath("/admin/posts");

	return { success: true };
}

// ── Delete Post ───────────────────────────────────────────────────────────────

export type DeletePostState = { success?: boolean; error?: string };

export async function deletePost(
	_prevState: DeletePostState,
	formData: FormData,
): Promise<DeletePostState> {
	await requireAdmin();
	const postId = formData.get("postId") as string;
	if (!postId) return { error: "Missing post ID." };

	await db
		.update(posts)
		.set({ deletedAt: new Date() })
		.where(eq(posts.id, postId));

	revalidatePath("/blog");
	revalidatePath("/admin");
	revalidatePath("/admin/posts");

	return { success: true };
}

// ── Categories ────────────────────────────────────────────────────────────────

const categorySchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(100)
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase, numbers, hyphens only",
		),
	description: z.string().optional(),
});

export type CategoryState = {
	success?: boolean;
	errors?: { name?: string; slug?: string; description?: string };
};

export async function createCategory(
	_prevState: CategoryState,
	formData: FormData,
): Promise<CategoryState> {
	await requireAdmin();
	const parsed = categorySchema.safeParse({
		name: formData.get("name"),
		slug: formData.get("slug"),
		description: formData.get("description") || undefined,
	});

	if (!parsed.success) {
		const fe = parsed.error.flatten().fieldErrors;
		return {
			errors: {
				name: fe.name?.[0],
				slug: fe.slug?.[0],
				description: fe.description?.[0],
			},
		};
	}

	try {
		await db.insert(categories).values(parsed.data);
	} catch {
		return {
			errors: { name: "A category with this name or slug already exists." },
		};
	}

	revalidatePath("/admin/categories");
	return { success: true };
}

export async function deleteCategory(
	_prevState: { success?: boolean; error?: string },
	formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
	await requireAdmin();
	const id = formData.get("id") as string;
	if (!id) return { error: "Missing ID." };
	await db.delete(categories).where(eq(categories.id, id));
	revalidatePath("/admin/categories");
	return { success: true };
}
