ALTER TABLE "comments" ADD COLUMN "email" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "is_anonymous" boolean DEFAULT false NOT NULL;