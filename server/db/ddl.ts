/**
 * DDL de arranque (espejo de server/db/migrations/0000_hard_sandman.sql).
 * Se incrusta como constante para poder ejecutarlo desde el endpoint /api/setup
 * en Vercel, donde no hay terminal para correr `npm run db:migrate`.
 *
 * Si cambia el esquema: regenerar con `npm run db:generate` y actualizar esto.
 * Los marcadores `--> statement-breakpoint` separan sentencias (Neon HTTP
 * ejecuta de a una).
 */
export const DDL = `CREATE TYPE "public"."post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body_md" text NOT NULL,
	"cover_image" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" text NOT NULL,
	"kicker" text,
	"description" text,
	"body_md" text,
	"seo_title" text,
	"seo_description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" text NOT NULL,
	"kicker" text,
	"summary" text,
	"body_md" text,
	"icon" varchar(40),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" text NOT NULL,
	"category" varchar(40) NOT NULL,
	"summary" text,
	"body_md" text,
	"image" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"label" text,
	"group" varchar(60),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"mode" varchar(20) DEFAULT 'link' NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"image" text,
	"link" text,
	"link_label" text,
	"slug" varchar(200),
	"body_md" text,
	"seo_title" text,
	"seo_description" text,
	"date" date,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"phone" varchar(60) NOT NULL,
	"comuna" varchar(120),
	"message" text,
	"handled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);`

/**
 * Cambios sobre tablas que YA existen (espejo de las migraciones posteriores a
 * la 0000). El DDL de arriba sólo sirve para una base vacía: en una base creada
 * antes, `CREATE TABLE` se ignora por "ya existe" y las columnas nuevas nunca
 * llegarían. /api/setup ejecuta esta lista después del DDL.
 *
 * Todas las sentencias deben ser idempotentes: `ADD COLUMN IF NOT EXISTS`, o
 * bien fallar con "ya existe" (el ejecutor traga 42P07 y 42710).
 */
export const ALTERS = `ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "mode" varchar(20) DEFAULT 'link' NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "slug" varchar(200);--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "body_md" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "seo_title" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "seo_description" text;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_slug_unique" UNIQUE("slug");`
