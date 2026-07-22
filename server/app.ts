/**
 * Aplicación Express de Vetlain.
 * Se usa en dos contextos:
 *  - Desarrollo: server/dev.ts la levanta en http://localhost:3001 y Vite le
 *    hace proxy de /api.
 *  - Producción: api/index.ts la exporta como función serverless de Vercel,
 *    montada en /api/*.
 *
 * Los routers de contenido, blog y autenticación se irán montando aquí en las
 * fases siguientes.
 */
import express from 'express'
import cookieParser from 'cookie-parser'

export function createApp() {
  const app = express()

  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  const api = express.Router()

  api.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'vetlain-api' })
  })

  app.use('/api', api)

  return app
}
