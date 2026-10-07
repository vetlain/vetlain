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
import { validateContact } from '../../src/lib/contact-validation.js'

export const contactRouter = Router()

// Forma del cuerpo; las reglas de cada campo están en validateContact.
const contactSchema = z.object({
  name: z.string().max(500).default(''),
  phone: z.string().max(100).default(''),
  comuna: z.string().max(500).nullish(),
  message: z.string().max(5000).nullish(),
  // Honeypot anti-spam: campo oculto que los humanos dejan vacío. Se acepta
  // cualquier valor aquí para manejarlo abajo (200 silencioso si viene lleno).
  website: z.string().nullish(),
})

contactRouter.post('/', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Revisa los datos del formulario.' })
    return
  }
  const { website, ...raw } = parsed.data

  // Si el honeypot viene lleno, es un bot: respondemos ok pero no guardamos.
  if (website) {
    res.json({ ok: true })
    return
  }

  const result = validateContact({
    name: raw.name,
    phone: raw.phone,
    comuna: raw.comuna ?? '',
    message: raw.message ?? '',
  })
  if (!result.ok) {
    res.status(400).json({ error: 'Revisa los datos del formulario.', fields: result.errors })
    return
  }
  const { name, phone, comuna, message } = result.value

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
