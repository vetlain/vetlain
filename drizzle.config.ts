import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { getDatabaseUrl } from './server/env'

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(true),
  },
})
