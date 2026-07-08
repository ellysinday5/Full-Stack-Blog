import { db } from "./index";
import { comments, posts } from "./schema";

async function seed() {
	console.log("Seeding database...");

	const insertedPosts = await db
		.insert(posts)
		.values([
			{
				title: "Getting Started with Next.js 16",
				slug: "getting-started-with-nextjs-16",
				body: "Next.js 16 brings a refined App Router experience with faster builds via Turbopack and improved React 19 support. In this post we walk through setting up a new project and exploring the core file conventions.",
			},
			{
				title: "Understanding Server Actions",
				slug: "understanding-server-actions",
				body: "Server Actions let you run server-side code directly from your components without manually creating API routes. Combined with useActionState and useFormStatus, they make building forms significantly simpler.",
			},
			{
				title: "Why We Chose Drizzle ORM",
				slug: "why-we-chose-drizzle-orm",
				body: "Drizzle offers a lightweight, type-safe way to interact with Postgres without the overhead of a heavier ORM. Paired with Neon's serverless driver, it fits naturally into edge and serverless environments.",
			},
		])
		.returning();

	await db.insert(comments).values([
		{
			postId: insertedPosts[0].id,
			authorName: "Jane Doe",
			body: "Great intro post, really helped me get started!",
		},
		{
			postId: insertedPosts[1].id,
			authorName: "John Smith",
			body: "Server Actions have simplified my forms so much.",
		},
	]);

	console.log("Seeding complete!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
