import { asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { AdminDashboard } from "./admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Admin | Write Post",
	description: "Create a new blog post",
};

export default async function AdminPage() {
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
