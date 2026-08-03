CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"image" text,
	"link" text,
	"link_label" text,
	"date" date,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
