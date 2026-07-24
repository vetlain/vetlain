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
