import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, comments, posts } from "@/lib/db/schema";
import { CommentsTable } from "./comments-table";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Admin | Manage Comments",
};

export default async function AdminCommentsPage() {
	const allComments = await db
		.select({
			id: comments.id,
			authorName: comments.authorName,
			email: comments.email,
			body: comments.body,
			approved: comments.approved,
			createdAt: comments.createdAt,
			isAnonymous: comments.isAnonymous,
			postTitle: posts.title,
			postSlug: posts.slug,
			categoryName: categories.name,
		})
		.from(comments)
		.innerJoin(posts, eq(posts.id, comments.postId))
		.leftJoin(categories, eq(categories.id, posts.categoryId))
		.orderBy(asc(comments.createdAt));

	const serialized = allComments.map((c) => ({
		...c,
		createdAt: c.createdAt.toISOString(),
		categoryName: c.categoryName ?? null,
	}));

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold text-[#1a2e1a] mb-6">
				Manage Comments
			</h1>
			<CommentsTable comments={serialized} />
		</div>
	);
}
