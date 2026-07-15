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
          // Identidad real de marca — Prototipos 2 y 3 (verde + carbón, del logo).
          // P3 usa esta misma colorimetría por decisión del cliente (jul 2026).
          green: '#3d8b40',
          'green-dark': '#2c6a31',
          'green-deep': '#1e4d24',
          'green-tint': '#eef4ec',
          ink: '#1a1a1a',
          'ink-soft': '#2e2e2e',
        },
      },
    },
  },
  plugins: [],
}
