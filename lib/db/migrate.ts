import { db } from "./index";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function run() {
	console.log("Applying migrations via neon-http...");
	try {
		await migrate(db, { migrationsFolder: "./drizzle" });
		console.log("Migrations applied successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
}

run();
