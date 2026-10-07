/**
 * Aviso por correo de cada contacto del formulario del sitio.
 *
 * Envía por el SMTP de Gmail con una cuenta personal y una contraseña de
 * aplicación (Cuenta de Google → Seguridad → Contraseñas de aplicaciones).
 * Variables: SMTP_USER, SMTP_PASS y, opcional, CONTACT_NOTIFY_TO (lista
 * separada por comas; si falta se usa DEFAULT_RECIPIENTS).
 *
 * El diseño vive en server/emails/lead.html (su <title> es el asunto). Vista
 * previa local: `npm run email:preview`.
 *
 * Si faltan las credenciales no se envía nada: el lead igual queda guardado en
 * la base y visible en el panel, que es la fuente de verdad.
 */
import { readFileSync } from 'node:fs'
import nodemailer from 'nodemailer'
import type { Lead } from './db/schema.js'

const DEFAULT_RECIPIENTS = [
  'echan@vzgroups.com',
  'vzamora@vzgroups.com',
  'varavena@vzgroups.com',
  'jennyp@vzgroups.com',
]

/** Ruta de la plantilla. En Vercel se incluye en la función vía vercel.json. */
const TEMPLATE_URL = new URL('./emails/lead.html', import.meta.url)

function recipients(): string[] {
  const raw = process.env.CONTACT_NOTIFY_TO
  if (!raw) return DEFAULT_RECIPIENTS
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/**
 * Teléfono → enlace de WhatsApp (solo dígitos; asume Chile si viene sin código)
 * con el saludo ya escrito, para que quien responde solo complete el resto.
 */
function whatsappLink(phone: string, name: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 9 && digits.startsWith('9')) digits = '56' + digits
  if (digits.length < 8) return ''
  const greeting = `Hola ${name.trim().replace(/\s+/g, ' ')}, `
  return `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`
}

/** Valores de la plantilla para un lead, sin escapar. */
export function leadVars(lead: Lead): Record<string, string> {
  const site = (process.env.SITE_URL || 'https://vetlain.cl').replace(/\/$/, '')
  return {
    nombre: lead.name,
    telefono: lead.phone,
    comuna: lead.comuna ?? '',
    mensaje: lead.message ?? '',
    fecha: lead.createdAt.toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      dateStyle: 'full',
      timeStyle: 'short',
    })
      // "2:50 p. m." no debe partirse entre líneas.
      .replace(/(\d)\s+([ap])\.\s?m\./, '$1\u00a0$2.\u00a0m.'),
    whatsapp_url: whatsappLink(lead.phone, lead.name),
    telefono_url: `tel:${lead.phone.replace(/[^\d+]/g, '')}`,
    panel_url: `${site}/admin`,
    sitio_url: site,
    logo_url: `${site}/brand/logo-email.png`,
  }
}

/**
 * Plantilla mínima tipo mustache:
 *  - {{#x}}…{{/x}} se muestra si x tiene valor; {{^x}}…{{/x}} si está vacía.
 *  - {{x}} se reemplaza por el valor escapado; los saltos de línea pasan a <br>.
 */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  const sections = /\{\{([#^])(\w+)\}\}([\s\S]*?)\{\{\/\2\}\}/g
  let out = template
  // Repetir hasta que no queden bloques (permite anidarlos).
  for (let prev = ''; prev !== out; ) {
    prev = out
    out = out.replace(sections, (_, kind: string, key: string, body: string) =>
      Boolean(vars[key]) === (kind === '#') ? body : '',
    )
  }
  return out.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    escapeHtml(vars[key] ?? '').replace(/\r?\n/g, '<br>'),
  )
}

/** Arma asunto, HTML y texto plano del aviso de un lead. */
export function buildLeadEmail(lead: Lead) {
  const vars = leadVars(lead)
  // Los comentarios de la plantilla son documentación: no viajan en el correo.
  const template = readFileSync(TEMPLATE_URL, 'utf8').replace(/<!--[\s\S]*?-->\s*/g, '')
  const html = renderTemplate(template, vars)
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? `Nuevo contacto web: ${lead.name}`
  // El asunto no es HTML: deshacer el escape del <title>.
  const subject = title
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()

  const text = [
    'Nuevo contacto desde el formulario de vetlain.cl',
    '',
    `Nombre: ${vars.nombre}`,
    `Teléfono: ${vars.telefono}`,
    `Comuna: ${vars.comuna || '—'}`,
    `Mensaje: ${vars.mensaje || '—'}`,
    `Recibido: ${vars.fecha}`,
    '',
    vars.whatsapp_url ? `Responder por WhatsApp: ${vars.whatsapp_url}` : '',
    `Ver en el panel: ${vars.panel_url}`,
  ]
    .filter((l, i, all) => l !== '' || all[i - 1] !== '')
    .join('\n')

  return { subject, html, text }
}

/**
 * Envía el aviso de un lead. Nunca lanza: un fallo de correo no debe hacer
 * fallar el formulario, que ya guardó el contacto. Devuelve si se envió.
 */
export async function notifyLead(lead: Lead): Promise<boolean> {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = recipients()
  if (!user || !pass || !to.length) {
    console.warn('[mailer] SMTP_USER/SMTP_PASS sin configurar: no se envía aviso del lead', lead.id)
    return false
  }

  try {
    const { subject, html, text } = buildLeadEmail(lead)
    // Timeouts cortos: la función serverless espera el envío antes de
    // responder al visitante, y Gmail a veces tarda en saludar.
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    })
    await transport.sendMail({ from: { name: 'Sitio Vetlain', address: user }, to, subject, html, text })
    return true
  } catch (err) {
    console.error('[mailer] No se pudo enviar el aviso del lead', lead.id, err)
    return false
  }
}
