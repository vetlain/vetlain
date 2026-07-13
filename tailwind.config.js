/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vetlain: {
          // Prototipo 1 — Confianza Corporativa (azul del informe)
          blue: '#1b4f72',
          'blue-dark': '#123650',
          slate: '#5d6d7e',
          bg: '#f4f7f9',
          // Identidad real de marca — Prototipo 2 (verde + carbón, del logo)
          green: '#3d8b40',
          'green-dark': '#2c6a31',
          'green-deep': '#1e4d24',
          'green-tint': '#eef4ec',
          ink: '#1a1a1a',
          'ink-soft': '#2e2e2e',
        },
        // Prototipo 3 — Terreno Rápido (colorimetría hazard: negro/rojo/amarillo)
        hazard: {
          black: '#0c0c0c',
          ink: '#171717',
          red: '#e11414',
          'red-dark': '#a10f0f',
          yellow: '#f7c600',
          'yellow-bright': '#ffd21a',
        },
      },
    },
  },
  plugins: [],
}
