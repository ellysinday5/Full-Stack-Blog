"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";

export type ModerationState = {
	success?: boolean;
	error?: string;
};

// ── Auth helper ───────────────────────────────────────────────────────────────
async function requireAdmin(): Promise<ModerationState | null> {
	const cookieStore = await cookies();
	const session = cookieStore.get("admin_session");
	if (!session || session.value !== "authenticated") {
		return { error: "Unauthorized. Please log in again." };
	}
	return null;
}

// ── Approve / toggle approved ─────────────────────────────────────────────────
const moderateSchema = z.object({
	commentId: z.string().uuid("Invalid comment ID"),
	approved: z.boolean(),
	slug: z.string().min(1),
});

export async function moderateComment(
	_prevState: ModerationState,
	formData: FormData,
): Promise<ModerationState> {
	const authErr = await requireAdmin();
	if (authErr) return authErr;

	const parsed = moderateSchema.safeParse({
		commentId: formData.get("commentId"),
		approved: formData.get("approved") === "true",
		slug: formData.get("slug"),
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().formErrors[0] ?? "Invalid input" };
	}

	const { commentId, approved, slug } = parsed.data;
	await db.update(comments).set({ approved }).where(eq(comments.id, commentId));

	revalidatePath(`/blog/${slug}`);
	revalidatePath("/blog");
	revalidatePath("/admin/comments");

	return { success: true };
}

// ── Delete comment ────────────────────────────────────────────────────────────
const deleteSchema = z.object({
	commentId: z.string().uuid("Invalid comment ID"),
	slug: z.string().min(1),
});

export async function deleteComment(
	_prevState: ModerationState,
	formData: FormData,
): Promise<ModerationState> {
	const authErr = await requireAdmin();
	if (authErr) return authErr;

	const parsed = deleteSchema.safeParse({
		commentId: formData.get("commentId"),
		slug: formData.get("slug"),
	});

	if (!parsed.success) {
		return { error: parsed.error.flatten().formErrors[0] ?? "Invalid input" };
	}

	const { commentId, slug } = parsed.data;
	await db.delete(comments).where(eq(comments.id, commentId));

	revalidatePath(`/blog/${slug}`);
	revalidatePath("/blog");
	revalidatePath("/admin/comments");

	return { success: true };
}
