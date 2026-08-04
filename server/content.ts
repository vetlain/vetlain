/**
 * Consultas de contenido público, compartidas entre la API (server/routes/public.ts)
 * y el script de prerender (server/prerender.tsx). Un solo lugar para la lógica
 * de "qué se considera publicado".
 */
import { eq, desc } from 'drizzle-orm'
import { db, schema } from './db/index.js'

export async function getSiteContentMap(): Promise<Record<string, unknown>> {
  const rows = await db.select().from(schema.siteContent)
  const map: Record<string, unknown> = {}
  for (const row of rows) map[row.key] = row.value
  return map
}

export function getAllPages() {
  return db.select().from(schema.pages)
}

export async function getPageBySlug(slug: string) {
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug)).limit(1)
  return page ?? null
}

export function getPublishedServices() {
  return db
    .select()
    .from(schema.services)
    .where(eq(schema.services.published, true))
    .orderBy(schema.services.sortOrder)
}

export async function getServiceBySlug(slug: string) {
  const [service] = await db.select().from(schema.services).where(eq(schema.services.slug, slug)).limit(1)
  return service && service.published ? service : null
}

export function getPublishedProducts() {
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.published, true))
    .orderBy(schema.products.sortOrder)
}

export async function getProductBySlug(slug: string) {
  const [product] = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1)
  return product && product.published ? product : null
}

/** Novedades visibles en la portada, en el orden definido en el panel. */
export function getPublishedNews() {
  return db
    .select()
    .from(schema.news)
    .where(eq(schema.news.published, true))
    .orderBy(schema.news.sortOrder, desc(schema.news.date))
}

/**
 * Novedad con página propia (/novedades/:slug). Sólo existe para las del modo
 * 'entry': las de modo 'link' apuntan a otra parte y no tienen página.
 */
export async function getNewsBySlug(slug: string) {
  const [item] = await db.select().from(schema.news).where(eq(schema.news.slug, slug)).limit(1)
  return item && item.published && item.mode === 'entry' ? item : null
}

export function getPublishedBlogPosts() {
  return db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.status, 'published'))
    .orderBy(desc(schema.blogPosts.publishedAt))
}

export async function getBlogPostBySlug(slug: string) {
  const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug)).limit(1)
  return post && post.status === 'published' ? post : null
}
