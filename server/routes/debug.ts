/**
 * Diagnóstico temporal: qué variables de entorno están presentes (sin exponer
 * sus valores) y si la conexión a la base realmente funciona.
 *
 *   GET /api/debug-env
 *
 * Quitar esta ruta (o su registro en app.ts) una vez resuelto el arranque.
 */
import { Router } from 'express'
import { neon } from '@neondatabase/serverless'
import { getDatabaseUrl } from '../env.js'

export const debugRouter = Router()

const KEYS = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'DATABASE_URL_UNPOOLED',
  'JWT_SECRET',
  'SETUP_TOKEN',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'SITE_URL',
]

debugRouter.get('/', async (_req, res) => {
  const present: Record<string, boolean> = {}
  for (const k of KEYS) present[k] = Boolean(process.env[k])

  let dbTest: { ok: boolean; detail?: string } = { ok: false }
  try {
    const url = getDatabaseUrl()
    const sql = neon(url)
    await sql.query('select 1')
    dbTest = { ok: true }
  } catch (err) {
    dbTest = { ok: false, detail: err instanceof Error ? (err.stack ?? err.message) : String(err) }
  }

  res.json({ env_present: present, db_connection: dbTest })
})
