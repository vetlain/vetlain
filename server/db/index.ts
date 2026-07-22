/**
 * Cliente de base de datos (Neon serverless + Drizzle).
 * Usa el driver HTTP de Neon, ideal para funciones serverless en Vercel.
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'Falta DATABASE_URL. Copia .env.example a .env y pega tu connection string de Neon.',
  )
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })
export { schema }
