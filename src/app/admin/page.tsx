import { asc, desc, isNull } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { AdminDashboard } from "./admin-dashboard";

// export const dynamic = "force-dynamic";

export const metadata = {
	title: "Admin | Write Post",
	description: "Create a new blog post",
};

export default async function AdminPage() {
	await connection();
	const [allPosts, allCategories] = await Promise.all([
		db
			.select({
				id: posts.id,
				title: posts.title,
				slug: posts.slug,
				status: posts.status,
				body: posts.body,
				createdAt: posts.createdAt,
			})
			.from(posts)
			.where(isNull(posts.deletedAt))
			.orderBy(desc(posts.createdAt))
			.catch(() => []),
		db
			.select({ id: categories.id, name: categories.name })
			.from(categories)
			.orderBy(asc(categories.name))
			.catch(() => []),
	]);

	const serializedPosts = allPosts.map((p) => ({
		...p,
		createdAt: p.createdAt.toISOString(),
	}));

	return <AdminDashboard posts={serializedPosts} categories={allCategories} />;
}
