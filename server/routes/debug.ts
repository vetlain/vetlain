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
  'DEPLOY_HOOK_URL',
  'BLOB_READ_WRITE_TOKEN',
]

/** Tablas que el sitio espera encontrar (ver server/db/schema.ts). */
const TABLAS_ESPERADAS = [
  'admin_users',
  'site_content',
  'pages',
  'services',
  'products',
  'news',
  'blog_posts',
  'leads',
]

debugRouter.get('/', async (_req, res) => {
  const present: Record<string, boolean> = {}
  for (const k of KEYS) present[k] = Boolean(process.env[k])

  let dbTest: { ok: boolean; detail?: string } = { ok: false }
  // Qué tablas faltan por crear: es lo primero que hay que mirar cuando el panel
  // muestra ceros o una sección no carga tras un despliegue con esquema nuevo.
  let tablas: { existentes: string[]; faltan: string[] } | null = null
  try {
    const url = getDatabaseUrl()
    const sql = neon(url)
    await sql.query('select 1')
    dbTest = { ok: true }
    const rows = (await sql.query(
      "select table_name from information_schema.tables where table_schema = 'public'",
    )) as { table_name: string }[]
    const existentes = rows.map((r) => r.table_name).sort()
    tablas = {
      existentes,
      faltan: TABLAS_ESPERADAS.filter((t) => !existentes.includes(t)),
    }
  } catch (err) {
    dbTest = { ok: false, detail: err instanceof Error ? (err.stack ?? err.message) : String(err) }
  }

  res.json({ env_present: present, db_connection: dbTest, tablas })
})
