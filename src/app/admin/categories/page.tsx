import { asc, count, eq } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { CategoryForm } from "./category-form";
import { CategoryList } from "./category-list";

// export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Categories" };

export default async function CategoriesPage() {
	await connection();
	let rows: Array<{
		id: string;
		name: string;
		slug: string;
		description: string | null;
		createdAt: Date;
		postCount: number;
	}> = [];

	try {
		rows = await db
			.select({
				id: categories.id,
				name: categories.name,
				slug: categories.slug,
				description: categories.description,
				createdAt: categories.createdAt,
				postCount: count(posts.id),
			})
			.from(categories)
			.leftJoin(posts, eq(posts.categoryId, categories.id))
			.groupBy(categories.id)
			.orderBy(asc(categories.name));
	} catch (error) {
		console.error(
			"Failed to load categories for the admin categories page",
			error,
		);
	}

	const serialized = rows.map((r) => ({
		...r,
		createdAt: r.createdAt.toISOString(),
		postCount: Number(r.postCount),
	}));

	return (
		<div className="w-full">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-[#1a2e1a]">Categories</h1>
				<p className="mt-1 text-sm text-[#4a6a4a]">
					Organise your posts into categories. These will be available when
					writing a post.
				</p>
			</div>

			<div className="flex gap-8 items-start">
				{/* ── Create form ── */}
				<div className="w-80 shrink-0">
					<CategoryForm />
				</div>

				{/* ── List ── */}
				<div className="flex-1 min-w-0">
					<CategoryList categories={serialized} />
				</div>
			</div>
		</div>
	);
}
