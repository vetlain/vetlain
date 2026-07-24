/**
 * Recepción de contactos del formulario del sitio (público).
 *   POST /api/contact
 * Guarda el lead en la base para que el cliente lo vea en el panel.
 */
import { Router } from 'express'
import { z } from 'zod'
import { db, schema } from '../db/index.js'

export const contactRouter = Router()

const contactSchema = z.object({
  name: z.string().trim().min(1).max(160),
  phone: z.string().trim().min(1).max(60),
  comuna: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  // Honeypot anti-spam: campo oculto que los humanos dejan vacío. Se acepta
  // cualquier valor aquí para manejarlo abajo (200 silencioso si viene lleno).
  website: z.string().optional(),
})

contactRouter.post('/', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Revisa los datos del formulario.' })
    return
  }
  const { name, phone, comuna, message, website } = parsed.data

  // Si el honeypot viene lleno, es un bot: respondemos ok pero no guardamos.
  if (website) {
    res.json({ ok: true })
    return
  }

  await db.insert(schema.leads).values({
    name,
    phone,
    comuna: comuna || null,
    message: message || null,
  })
  res.json({ ok: true })
})
