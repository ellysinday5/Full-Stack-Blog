import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { PostViewer } from "./post-viewer";

export const metadata = { title: "Admin | View Post" };

export default async function EditPostPage(props: {
	params: Promise<{ id: string }>;
}) {
	await connection();
	const params = await props.params;
	const post = await db.query.posts.findFirst({
		where: eq(posts.id, params.id),
	});

	if (!post) {
		notFound();
	}

	const allCategories = await db.select().from(categories);

	return (
		<div className="w-full">
			<PostViewer post={post} categories={allCategories} />
		</div>
	);
}
