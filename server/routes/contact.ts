/**
 * Recepción de contactos del formulario del sitio (público).
 *   POST /api/contact
 * Guarda el lead en la base para que el cliente lo vea en el panel y avisa
 * por correo (server/mailer.ts).
 */
import { Router } from 'express'
import { z } from 'zod'
import { db, schema } from '../db/index.js'
import { notifyLead } from '../mailer.js'

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

  const [lead] = await db
    .insert(schema.leads)
    .values({
      name,
      phone,
      comuna: comuna || null,
      message: message || null,
    })
    .returning()
  // Se espera el envío antes de responder: en Vercel la función se congela al
  // responder y un envío pendiente se perdería. notifyLead nunca lanza.
  await notifyLead(lead)
  res.json({ ok: true })
})
