/**
 * Reglas del formulario de contacto. Las usan el formulario del sitio (para
 * avisar junto a cada campo y autoformatear el teléfono) y POST /api/contact
 * (que las vuelve a aplicar: el navegador nunca es garantía).
 *
 * Módulo puro, sin React: también lo importa el servidor.
 */

export type ContactInput = { name: string; phone: string; comuna: string; message: string }
export type ContactField = keyof ContactInput
export type ContactErrors = Partial<Record<ContactField, string>>

export const CONTACT_LIMITS = { nameMax: 80, comunaMax: 60, messageMin: 5, messageMax: 2000 } as const

/** Letras (con tildes, ñ, ü…), espacios, apóstrofo, punto y guion. */
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u
/** Lo que se permite escribir en un teléfono antes de normalizarlo. */
const PHONE_CHARS_RE = /^[\d\s+().-]+$/

const clean = (s: string) => s.trim().replace(/\s+/g, ' ')

/**
 * Normaliza un teléfono chileno a su forma escrita estándar, o null si no es
 * válido. Acepta cualquier separador y con o sin +56:
 *   "968302857", "9 6830 2857", "56968302857" → "+56 9 6830 2857"  (celular)
 *   "228153975"                               → "+56 2 2815 3975"  (fijo Santiago)
 *   "322123456"                               → "+56 32 212 3456"  (fijo regional)
 */
export function normalizeChileanPhone(raw: string): string | null {
  if (!PHONE_CHARS_RE.test(raw.trim())) return null
  let d = raw.replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('56')) d = d.slice(2)
  // Prefijo antiguo "09 …" o "02 …".
  if (d.length === 10 && d.startsWith('0')) d = d.slice(1)
  if (d.length !== 9 || !/^[2-9]/.test(d)) return null
  if (d[0] === '9' || d[0] === '2') return `+56 ${d[0]} ${d.slice(1, 5)} ${d.slice(5)}`
  return `+56 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`
}

/** Valida y limpia los campos. Devuelve los valores listos para guardar o los errores. */
export function validateContact(
  input: ContactInput,
): { ok: true; value: ContactInput } | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {}
  const name = clean(input.name)
  const comuna = clean(input.comuna)
  const message = input.message.trim()
  const phone = normalizeChileanPhone(input.phone)

  if (name.length < 2) errors.name = 'Escribe tu nombre.'
  else if (name.length > CONTACT_LIMITS.nameMax) errors.name = `Máximo ${CONTACT_LIMITS.nameMax} caracteres.`
  else if (!NAME_RE.test(name)) errors.name = 'Usa solo letras, sin números ni símbolos.'

  if (!input.phone.trim()) errors.phone = 'Escribe tu teléfono.'
  else if (!phone) errors.phone = 'Ingresa un teléfono chileno de 9 dígitos, ej: 9 6830 2857.'

  if (comuna) {
    if (comuna.length > CONTACT_LIMITS.comunaMax) errors.comuna = `Máximo ${CONTACT_LIMITS.comunaMax} caracteres.`
    else if (!NAME_RE.test(comuna)) errors.comuna = 'Usa solo letras, ej: Talagante.'
  }

  if (message.length < CONTACT_LIMITS.messageMin) errors.message = 'Cuéntanos brevemente qué viste.'
  else if (message.length > CONTACT_LIMITS.messageMax)
    errors.message = `Máximo ${CONTACT_LIMITS.messageMax} caracteres.`

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, value: { name, phone: phone!, comuna, message } }
}
