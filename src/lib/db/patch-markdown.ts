/**
 * One-time patch: strip raw markdown ** bold markers from post bodies.
 * Run with: npx tsx src/lib/db/patch-markdown.ts
 */
import { like } from "drizzle-orm";
import { db } from "./index";
import { posts } from "./schema";

async function patch() {
	// Fetch only posts whose body contains **
	const affected = await db
		.select({ id: posts.id, body: posts.body })
		.from(posts)
		.where(like(posts.body, "%**%"));

	if (affected.length === 0) {
		console.log("No posts with ** markers found. Nothing to do.");
		process.exit(0);
	}

	for (const post of affected) {
		// Replace **text** bold markers — turn them into plain text
		const cleaned = post.body.replace(/\*\*(.+?)\*\*/g, "$1");
		await db
			.update(posts)
			.set({ body: cleaned })
			.where(like(posts.body, "%**%"));
		console.log(`Patched post ${post.id}`);
	}

	console.log(`Done. Patched ${affected.length} post(s).`);
	process.exit(0);
}

patch().catch((err) => {
	console.error("Patch failed:", err);
	process.exit(1);
});
