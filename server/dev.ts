/**
 * Servidor de desarrollo del backend.
 * Carga variables de entorno desde .env y levanta Express en el puerto local.
 * En producción NO se usa este archivo: Vercel importa api/index.ts.
 */
import 'dotenv/config'
import { createApp } from './app'

const app = createApp()
const port = Number(process.env.PORT) || 8787

app.listen(port, () => {
  console.log(`API de Vetlain escuchando en http://localhost:${port}`)
})
