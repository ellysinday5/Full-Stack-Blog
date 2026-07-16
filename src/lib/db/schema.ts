import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	body: text("body").notNull(),
	tags: text("tags").array().default([]).notNull(),
	status: text("status", { enum: ["published", "draft", "archived"] })
		.default("published")
		.notNull(),
	categoryId: uuid("category_id").references(() => categories.id, {
		onDelete: "set null",
	}),
	coverImage: text("cover_image"),
	deletedAt: timestamp("deleted_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	authorName: text("author_name").notNull(),
	email: text("email").notNull().default(""),
	website: text("website"),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
	body: text("body").notNull(),
	approved: boolean("approved").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ many, one }) => ({
	comments: many(comments),
	category: one(categories, {
		fields: [posts.categoryId],
		references: [categories.id],
	}),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	posts: many(posts),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));

export const settings = pgTable("settings", {
	key: text("key").primaryKey(),
	value: text("value").notNull(),
});
