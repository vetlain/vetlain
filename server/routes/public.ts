/**
 * API pública de lectura (la consume el sitio). Solo devuelve contenido
 * publicado. Rutas bajo /api/*. La lógica de consulta vive en server/content.ts
 * (compartida con el script de prerender).
 */
import { Router } from 'express'
import {
  getSiteContentMap,
  getPageBySlug,
  getPublishedServices,
  getServiceBySlug,
  getPublishedBlogPosts,
  getBlogPostBySlug,
} from '../content.js'

export const publicRouter = Router()

publicRouter.get('/content', async (_req, res) => {
  res.json(await getSiteContentMap())
})

publicRouter.get('/pages/:slug', async (req, res) => {
  const page = await getPageBySlug(req.params.slug)
  if (!page) {
    res.status(404).json({ error: 'Página no encontrada' })
    return
  }
  res.json(page)
})

publicRouter.get('/services', async (_req, res) => {
  res.json(await getPublishedServices())
})

publicRouter.get('/services/:slug', async (req, res) => {
  const service = await getServiceBySlug(req.params.slug)
  if (!service) {
    res.status(404).json({ error: 'Servicio no encontrado' })
    return
  }
  res.json(service)
})

publicRouter.get('/blog', async (_req, res) => {
  res.json(await getPublishedBlogPosts())
})

publicRouter.get('/blog/:slug', async (req, res) => {
  const post = await getBlogPostBySlug(req.params.slug)
  if (!post) {
    res.status(404).json({ error: 'Entrada no encontrada' })
    return
  }
  res.json(post)
})
