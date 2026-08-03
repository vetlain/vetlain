/**
 * API privada del panel (/api/admin/*). Todo protegido por requireAuth.
 * CRUD de: contenido suelto (incluida la portada), páginas, servicios,
 * productos, novedades y blog, más la subida de imágenes.
 */
import { Router } from 'express'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'
import { requireAuth } from '../auth.js'
import { uploadsRouter } from './uploads.js'

export const adminRouter = Router()
adminRouter.use(requireAuth)

/* ── Subida de imágenes ──────────────────────────────────────────────── */
adminRouter.use('/uploads', uploadsRouter)

/* ── Publicar cambios (dispara un rebuild en Vercel) ──────────────────── */
// El sitio prerenderiza páginas como HTML estático en cada build (server/prerender.tsx).
// Este endpoint dispara ese rebuild vía un Deploy Hook de Vercel, sin exponer su
// URL al navegador (queda solo en la variable de entorno del servidor).
adminRouter.post('/publish', async (_req, res) => {
  const hook = process.env.DEPLOY_HOOK_URL
  if (!hook) {
    res.status(400).json({ error: 'DEPLOY_HOOK_URL no está configurado en el servidor.' })
    return
  }
  try {
    const r = await fetch(hook, { method: 'POST' })
    if (!r.ok) throw new Error(`El deploy hook respondió ${r.status}`)
    res.json({ ok: true })
  } catch (err) {
    res.status(502).json({ error: 'No se pudo iniciar la publicación.', detail: String(err) })
  }
})

/* ── Contenido suelto (site_content) ─────────────────────────────────── */

adminRouter.get('/content', async (_req, res) => {
  const rows = await db
    .select()
    .from(schema.siteContent)
    .orderBy(schema.siteContent.group, schema.siteContent.key)
  res.json(rows)
})

// Upsert: si la clave no existe todavía se crea. Necesario para los bloques de
// la portada (home.*), que pueden no estar en bases sembradas antes de existir.
// En un UPDATE no se tocan `label`/`group`: los pone el seed y son del panel.
adminRouter.put('/content/:key', async (req, res) => {
  const parsed = z
    .object({ value: z.any(), label: z.string().nullish(), group: z.string().nullish() })
    .safeParse(req.body)
  if (!parsed.success || parsed.data.value === undefined) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const { value, label, group } = parsed.data
  const [row] = await db
    .insert(schema.siteContent)
    .values({ key: req.params.key, value, label: label ?? null, group: group ?? null })
    .onConflictDoUpdate({
      target: schema.siteContent.key,
      set: { value, updatedAt: new Date() },
    })
    .returning()
  res.json(row)
})

/* ── Páginas ─────────────────────────────────────────────────────────── */

const pageFields = z.object({
  title: z.string().min(1),
  kicker: z.string().nullish(),
  description: z.string().nullish(),
  bodyMd: z.string().nullish(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

adminRouter.get('/pages', async (_req, res) => {
  res.json(await db.select().from(schema.pages).orderBy(schema.pages.slug))
})

adminRouter.put('/pages/:id', async (req, res) => {
  const parsed = pageFields.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.pages)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.pages.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Página no encontrada' })
    return
  }
  res.json(row)
})

/* ── Servicios ───────────────────────────────────────────────────────── */

const serviceFields = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  kicker: z.string().nullish(),
  summary: z.string().nullish(),
  bodyMd: z.string().nullish(),
  icon: z.string().nullish(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

adminRouter.get('/services', async (_req, res) => {
  res.json(await db.select().from(schema.services).orderBy(schema.services.sortOrder))
})

adminRouter.post('/services', async (req, res) => {
  const parsed = serviceFields.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db.insert(schema.services).values(parsed.data).returning()
  res.status(201).json(row)
})

adminRouter.put('/services/:id', async (req, res) => {
  const parsed = serviceFields.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.services)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.services.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Servicio no encontrado' })
    return
  }
  res.json(row)
})

adminRouter.delete('/services/:id', async (req, res) => {
  await db.delete(schema.services).where(eq(schema.services.id, Number(req.params.id)))
  res.json({ ok: true })
})

/* ── Productos ───────────────────────────────────────────────────────── */

const productFields = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['roedores', 'insectos', 'aves']),
  summary: z.string().nullish(),
  bodyMd: z.string().nullish(),
  image: z.string().nullish(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

adminRouter.get('/products', async (_req, res) => {
  res.json(await db.select().from(schema.products).orderBy(schema.products.sortOrder))
})

adminRouter.post('/products', async (req, res) => {
  const parsed = productFields.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db.insert(schema.products).values(parsed.data).returning()
  res.status(201).json(row)
})

adminRouter.put('/products/:id', async (req, res) => {
  const parsed = productFields.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.products.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }
  res.json(row)
})

adminRouter.delete('/products/:id', async (req, res) => {
  await db.delete(schema.products).where(eq(schema.products.id, Number(req.params.id)))
  res.json({ ok: true })
})

/* ── Blog ────────────────────────────────────────────────────────────── */

const postFields = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().nullish(),
  bodyMd: z.string().min(1),
  coverImage: z.string().nullish(),
  status: z.enum(['draft', 'published']).optional(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
})

// Lista TODAS las entradas (incl. borradores) para el panel.
adminRouter.get('/blog', async (_req, res) => {
  res.json(await db.select().from(schema.blogPosts).orderBy(schema.blogPosts.updatedAt))
})

adminRouter.get('/blog/:id', async (req, res) => {
  const [post] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.id, Number(req.params.id)))
    .limit(1)
  if (!post) {
    res.status(404).json({ error: 'Entrada no encontrada' })
    return
  }
  res.json(post)
})

adminRouter.post('/blog', async (req, res) => {
  const parsed = postFields.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const data = parsed.data
  // Al publicar por primera vez, fijar la fecha de publicación.
  const publishedAt = data.status === 'published' ? new Date() : null
  const [row] = await db
    .insert(schema.blogPosts)
    .values({ ...data, publishedAt })
    .returning()
  res.status(201).json(row)
})

adminRouter.put('/blog/:id', async (req, res) => {
  const parsed = postFields.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const id = Number(req.params.id)
  const [current] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.id, id))
    .limit(1)
  if (!current) {
    res.status(404).json({ error: 'Entrada no encontrada' })
    return
  }
  // Fija publishedAt la primera vez que pasa a "published".
  let publishedAt = current.publishedAt
  if (parsed.data.status === 'published' && !current.publishedAt) {
    publishedAt = new Date()
  }
  const [row] = await db
    .update(schema.blogPosts)
    .set({ ...parsed.data, publishedAt, updatedAt: new Date() })
    .where(eq(schema.blogPosts.id, id))
    .returning()
  res.json(row)
})

adminRouter.delete('/blog/:id', async (req, res) => {
  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, Number(req.params.id)))
  res.json({ ok: true })
})

/* ── Novedades de la portada ─────────────────────────────────────────── */

// `date` llega del <input type="date"> como 'YYYY-MM-DD'; vacío se guarda null.
const newsFields = z.object({
  title: z.string().min(1),
  excerpt: z.string().nullish(),
  image: z.string().nullish(),
  link: z.string().nullish(),
  linkLabel: z.string().nullish(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
    .or(z.literal(''))
    .nullish()
    .transform((v) => (v ? v : null)),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
})

adminRouter.get('/news', async (_req, res) => {
  res.json(await db.select().from(schema.news).orderBy(schema.news.sortOrder, desc(schema.news.date)))
})

adminRouter.post('/news', async (req, res) => {
  const parsed = newsFields.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db.insert(schema.news).values(parsed.data).returning()
  res.status(201).json(row)
})

adminRouter.put('/news/:id', async (req, res) => {
  const parsed = newsFields.partial().safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.news)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.news.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Novedad no encontrada' })
    return
  }
  res.json(row)
})

adminRouter.delete('/news/:id', async (req, res) => {
  await db.delete(schema.news).where(eq(schema.news.id, Number(req.params.id)))
  res.json({ ok: true })
})

/* ── Contactos recibidos (leads) ─────────────────────────────────────── */

// Más recientes primero.
adminRouter.get('/leads', async (_req, res) => {
  res.json(await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)))
})

// Marcar como atendido / no atendido.
adminRouter.put('/leads/:id', async (req, res) => {
  const parsed = z.object({ handled: z.boolean() }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Datos inválidos' })
    return
  }
  const [row] = await db
    .update(schema.leads)
    .set({ handled: parsed.data.handled })
    .where(eq(schema.leads.id, Number(req.params.id)))
    .returning()
  if (!row) {
    res.status(404).json({ error: 'Contacto no encontrado' })
    return
  }
  res.json(row)
})

adminRouter.delete('/leads/:id', async (req, res) => {
  await db.delete(schema.leads).where(eq(schema.leads.id, Number(req.params.id)))
  res.json({ ok: true })
})
