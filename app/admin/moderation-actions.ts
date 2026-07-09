"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
	commentId: z.string().uuid("Invalid comment ID"),
	approved: z.boolean(),
	slug: z.string().min(1),
	password: z.string().min(1, "Password is required"),
});

export type ModerationState = {
	success?: boolean;
	error?: string;
};

export async function moderateComment(
	_prevState: ModerationState,
	formData: FormData,
): Promise<ModerationState> {
	const parsed = schema.safeParse({
		commentId: formData.get("commentId"),
		approved: formData.get("approved") === "true",
		slug: formData.get("slug"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().formErrors[0] ?? "Invalid input" };
	}

	const { commentId, approved, slug, password } = parsed.data;

	if (password !== process.env.ADMIN_PASSWORD) {
		return { error: "Incorrect admin password" };
	}

	await db.update(comments).set({ approved }).where(eq(comments.id, commentId));

	revalidatePath(`/blog/${slug}`);
	revalidatePath("/blog");
	revalidatePath("/admin/comments");

	return { success: true };
}
