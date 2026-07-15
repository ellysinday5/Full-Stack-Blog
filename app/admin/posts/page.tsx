import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { ManagePostsTable } from "./manage-posts-table";
import { connection } from "next/server";

// export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Manage Posts" };

export default async function ManagePostsPage() {
	await connection();
	const allPosts = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			tags: posts.tags,
			status: posts.status,
			createdAt: posts.createdAt,
			categoryName: categories.name,
		})
		.from(posts)
		.leftJoin(categories, eq(posts.categoryId, categories.id))
		.orderBy(desc(posts.createdAt));

	const serialized = allPosts.map((p) => ({
		...p,
		createdAt: p.createdAt.toISOString(),
		categoryName: p.categoryName ?? null,
	}));

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold text-[#1a2e1a] mb-6">Manage Post</h1>
			<ManagePostsTable posts={serialized} />
		</div>
	);
}
