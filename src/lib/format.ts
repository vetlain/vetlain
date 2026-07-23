/** Formatea una fecha ISO a texto legible en español de Chile. */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}
