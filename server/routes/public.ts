/**
 * API pública de lectura (la consume el sitio, incl. el render en servidor).
 * Solo devuelve contenido publicado. Rutas bajo /api/*.
 */
import { Router } from 'express'
import { eq, desc } from 'drizzle-orm'
import { db, schema } from '../db'

export const publicRouter = Router()

/** Contenido suelto como objeto { key: value } para uso directo en el front. */
publicRouter.get('/content', async (_req, res) => {
  const rows = await db.select().from(schema.siteContent)
  const map: Record<string, unknown> = {}
  for (const row of rows) map[row.key] = row.value
  res.json(map)
})

publicRouter.get('/pages/:slug', async (req, res) => {
  const [page] = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.slug, req.params.slug))
    .limit(1)
  if (!page) {
    res.status(404).json({ error: 'Página no encontrada' })
    return
  }
  res.json(page)
})

publicRouter.get('/services', async (_req, res) => {
  const rows = await db
    .select()
    .from(schema.services)
    .where(eq(schema.services.published, true))
    .orderBy(schema.services.sortOrder)
  res.json(rows)
})

publicRouter.get('/services/:slug', async (req, res) => {
  const [service] = await db
    .select()
    .from(schema.services)
    .where(eq(schema.services.slug, req.params.slug))
    .limit(1)
  if (!service || !service.published) {
    res.status(404).json({ error: 'Servicio no encontrado' })
    return
  }
  res.json(service)
})

publicRouter.get('/blog', async (_req, res) => {
  const rows = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.status, 'published'))
    .orderBy(desc(schema.blogPosts.publishedAt))
  res.json(rows)
})

publicRouter.get('/blog/:slug', async (req, res) => {
  const [post] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, req.params.slug))
    .limit(1)
  if (!post || post.status !== 'published') {
    res.status(404).json({ error: 'Entrada no encontrada' })
    return
  }
  res.json(post)
})
