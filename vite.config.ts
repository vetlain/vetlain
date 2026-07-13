import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En producción el sitio se sirve bajo /vetlain/ (GitHub Pages project site).
// En dev se mantiene en / para no molestar el flujo local.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/vetlain/' : '/',
  plugins: [react()],
}))
