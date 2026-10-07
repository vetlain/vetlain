/**
 * Vista previa local de la plantilla del aviso de contacto.
 *
 *   npm run email:preview                 → genera .email-preview/*.html y abre el primero
 *   npm run email:preview -- --send a@b.c → además envía la versión completa a ese correo
 *                                           (usa SMTP_USER/SMTP_PASS de .env)
 *
 * Se regenera cada vez: edita server/emails/lead.html y vuelve a correrlo.
 */
import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { exec } from 'node:child_process'
import nodemailer from 'nodemailer'
import { buildLeadEmail } from './mailer.js'
import type { Lead } from './db/schema.js'

const samples: Record<string, Lead> = {
  completo: {
    id: 1,
    name: 'María José Fuentes',
    phone: '+56 9 6830 2857',
    comuna: 'Talagante',
    message:
      'Hola, tenemos ratones en la bodega de la planta desde hace dos semanas.\nNecesitamos un programa mensual con informe para la auditoría de diciembre.',
    handled: false,
    createdAt: new Date(),
  },
  minimo: {
    id: 2,
    name: 'Pedro',
    phone: '22815',
    comuna: null,
    message: null,
    handled: false,
    createdAt: new Date(),
  },
}

const dir = resolve('.email-preview')
mkdirSync(dir, { recursive: true })
// En local el logo de producción puede no existir aún: usar el archivo del repo.
const localLogo = pathToFileURL(resolve('public/brand/logo-email.png')).href

for (const [name, lead] of Object.entries(samples)) {
  const { subject, html } = buildLeadEmail(lead)
  const file = resolve(dir, `${name}.html`)
  writeFileSync(file, html.replace(/https?:\/\/[^"]+\/brand\/logo-email\.png/g, localLogo))
  console.log(`✓ ${name}: «${subject}» → ${file}`)
}

const first = resolve(dir, 'completo.html')
const opener = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open'
exec(`${opener} "${first}"`)

const sendIdx = process.argv.indexOf('--send')
if (sendIdx !== -1) {
  const to = process.argv[sendIdx + 1]
  const { SMTP_USER: user, SMTP_PASS: pass } = process.env
  if (!to || !user || !pass) {
    console.error('Para enviar: --send <correo> y SMTP_USER/SMTP_PASS en .env')
    process.exit(1)
  }
  const { subject, html, text } = buildLeadEmail(samples.completo)
  await nodemailer
    .createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })
    .sendMail({ from: { name: 'Sitio Vetlain', address: user }, to, subject: `[Prueba] ${subject}`, html, text })
  console.log(`✓ Prueba enviada a ${to}`)
}
