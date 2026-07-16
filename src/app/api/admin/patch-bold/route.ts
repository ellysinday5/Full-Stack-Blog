import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

// One-time endpoint to strip ** markdown bold markers from post bodies.
// DELETE this file after running it once in production.
// GET /api/admin/patch-bold
export async function GET() {
	try {
		const result = await db.execute(
			sql`UPDATE posts SET body = REGEXP_REPLACE(body, '\\*\\*([^*]+)\\*\\*', '\1', 'g') WHERE body LIKE '%**%'`
		);
		return Response.json({ ok: true, result });
	} catch (err) {
		return Response.json({ ok: false, error: String(err) }, { status: 500 });
	}
}
