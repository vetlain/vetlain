/**
 * Esquema de la base de datos Vetlain (Neon / Postgres) — Drizzle ORM.
 *
 * Diseño pequeño y enfocado:
 *  - admin_users   → login del panel (un solo administrador: el cliente).
 *  - site_content  → valores sueltos editables (clave→valor): teléfono, email,
 *                    dirección, horario, WhatsApp, redes sociales…
 *  - pages         → páginas largas editables (nosotros, cobertura, FAQ…).
 *  - services      → fichas de servicio (desratización, desinsectación…).
 *  - blog_posts    → entradas del blog (sin comentarios por ahora).
 *
 * Cada tabla con contenido público lleva campos SEO (seo_title / seo_description)
 * para que el cliente controle cómo se ve cada página en Google.
 */
import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core'

/** Estado de publicación de una entrada del blog. */
export const postStatus = pgEnum('post_status', ['draft', 'published'])

/** Administradores del panel. Para este proyecto: un único usuario (el cliente). */
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 120 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

/**
 * Contenido suelto del sitio, en formato clave→valor.
 * `value` es jsonb para admitir texto simple o pequeños objetos (p. ej. una
 * red social con { href, visible }). `label` y `group` son para el panel.
 */
export const siteContent = pgTable('site_content', {
  key: varchar('key', { length: 120 }).primaryKey(),
  value: jsonb('value').notNull(),
  label: text('label'),
  group: varchar('group', { length: 60 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Páginas largas editables (una fila = una URL). */
export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  title: text('title').notNull(),
  kicker: text('kicker'),
  description: text('description'),
  bodyMd: text('body_md'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Fichas de servicio (cuelgan de /servicios/:slug). */
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  title: text('title').notNull(),
  kicker: text('kicker'),
  summary: text('summary'),
  bodyMd: text('body_md'),
  icon: varchar('icon', { length: 40 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  published: boolean('published').default(true).notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Entradas del blog. Cuerpo en Markdown; se renderiza a HTML en el servidor. */
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  bodyMd: text('body_md').notNull(),
  coverImage: text('cover_image'),
  status: postStatus('status').default('draft').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Contactos recibidos por el formulario del sitio ("quiero que me llamen"). */
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  phone: varchar('phone', { length: 60 }).notNull(),
  comuna: varchar('comuna', { length: 120 }),
  message: text('message'),
  handled: boolean('handled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Tipos inferidos para reutilizar en la API y el frontend.
export type AdminUser = typeof adminUsers.$inferSelect
export type SiteContentRow = typeof siteContent.$inferSelect
export type Page = typeof pages.$inferSelect
export type Service = typeof services.$inferSelect
export type BlogPost = typeof blogPosts.$inferSelect
export type Lead = typeof leads.$inferSelect
