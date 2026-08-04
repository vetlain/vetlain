ALTER TABLE "news" ADD COLUMN "mode" varchar(20) DEFAULT 'link' NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "slug" varchar(200);--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "body_md" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_slug_unique" UNIQUE("slug");