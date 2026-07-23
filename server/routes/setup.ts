/**
 * Arranque de la base desde Vercel (sin terminal local).
 *
 *   GET /api/setup?token=EL_TOKEN
 *
 * Crea las tablas (DDL) y carga el contenido inicial (seed). Es idempotente:
 * si las tablas ya existen o los datos ya están, no rompe.
 *
 * Protegido por SETUP_TOKEN (variable de entorno). Tras dejar la base lista,
 * conviene borrar SETUP_TOKEN de Vercel para deshabilitar el endpoint.
 */
import { Router } from 'express'
import { neon } from '@neondatabase/serverless'
import { DDL } from '../db/ddl'
import { runSeed } from '../db/seed'

export const setupRouter = Router()

async function handleSetup(token: unknown): Promise<
  | { ok: true; tablas: string[]; seed: Awaited<ReturnType<typeof runSeed>> }
  | { ok: false; status: number; error: string }
> {
  const expected = process.env.SETUP_TOKEN
  if (!expected) {
    return { ok: false, status: 400, error: 'SETUP_TOKEN no está configurado en el entorno.' }
  }
  if (token !== expected) {
    return { ok: false, status: 401, error: 'Token de setup inválido.' }
  }
  const url = process.env.DATABASE_URL
  if (!url) {
    return { ok: false, status: 400, error: 'Falta DATABASE_URL en el entorno.' }
  }

  const sql = neon(url)
  const statements = DDL.split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean)

  const tablas: string[] = []
  for (const stmt of statements) {
    try {
      await sql.query(stmt)
      tablas.push('creada')
    } catch (err) {
      const code = (err as { code?: string })?.code
      const msg = (err as { message?: string })?.message ?? ''
      // 42P07: tabla ya existe · 42710: tipo/enum ya existe → idempotente.
      if (code === '42P07' || code === '42710' || /already exists/i.test(msg)) {
        tablas.push('ya existía')
        continue
      }
      throw err
    }
  }

  const seed = await runSeed()
  return { ok: true, tablas, seed }
}

setupRouter.get('/', async (req, res) => {
  try {
    const result = await handleSetup(req.query.token)
    if (!result.ok) {
      res.status(result.status).json({ error: result.error })
      return
    }
    res.json(result)
  } catch (err) {
    console.error('[setup] error:', err)
    res.status(500).json({ error: 'Falló el arranque de la base.', detalle: String(err) })
  }
})
