import { db } from "./index";
import { settings } from "./schema";
import { eq } from "drizzle-orm";

export async function getSetting(key: string, defaultValue: string): Promise<string> {
	try {
		const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
		if (result.length === 0) {
			return defaultValue;
		}
		return result[0].value;
	} catch (error) {
		console.error(`Error getting setting ${key}:`, error);
		return defaultValue;
	}
}

export async function setSetting(key: string, value: string): Promise<void> {
	try {
		const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
		if (result.length === 0) {
			await db.insert(settings).values({ key, value });
		} else {
			await db.update(settings).set({ value }).where(eq(settings.key, key));
		}
	} catch (error) {
		console.error(`Error setting ${key} to ${value}:`, error);
		throw error;
	}
}
