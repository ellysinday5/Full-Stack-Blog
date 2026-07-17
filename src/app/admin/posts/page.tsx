import { connection } from "next/server";
import { db } from "@/lib/db";
import { posts, categories } from "@/lib/db/schema";
import { desc, eq, isNull } from "drizzle-orm";
import { ManagePostsTable } from "./manage-posts-table";

async function fetchPosts() {
	return db
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
		.where(isNull(posts.deletedAt))
		.orderBy(desc(posts.createdAt));
}

export default async function ManagePostsPage() {
	await connection();

	let rawPosts: Awaited<ReturnType<typeof fetchPosts>> = [];
	let dbNotReady = false;

	try {
		rawPosts = await fetchPosts();
	} catch (e) {
		// Table not migrated yet (pre-demo state) — show empty instead of crashing
		console.error("Posts table not ready:", e);
		rawPosts = [];
		dbNotReady = true;
	}

	// ManagePostsTable expects createdAt as a string, tags as string[]
	const posts = rawPosts.map((p) => ({
		id: p.id,
		title: p.title,
		slug: p.slug,
		tags: p.tags ?? [],
		status: p.status,
		createdAt:
			p.createdAt instanceof Date
				? p.createdAt.toISOString()
				: String(p.createdAt),
		categoryName: p.categoryName,
	}));

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-[#1a2e1a]">Manage Posts</h1>
			</div>

			{dbNotReady && (
				<div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
					Database not initialized yet — run migrations to load posts.
				</div>
			)}

			<ManagePostsTable posts={posts} />
		</div>
	);
}
