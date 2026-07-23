/** Ejecuta el seed desde la terminal local: `npm run db:seed`. */
import 'dotenv/config'
import { runSeed } from './seed.js'

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error en el seed:', err)
    process.exit(1)
  })
