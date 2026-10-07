/**
 * Enlace de WhatsApp para responder a un contacto del formulario, con el
 * saludo ya escrito ("Hola {nombre}, ") para que quien responde complete el
 * resto. Lo usan el panel (LeadsPanel) y el correo de aviso (server/mailer.ts).
 *
 * Módulo puro, sin React: también lo importa el servidor.
 */
export function leadWhatsappUrl(phone: string, name: string): string {
  // Solo dígitos; un celular chileno de 9 dígitos sin código de país lo recibe.
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 9 && digits.startsWith('9')) digits = '56' + digits
  if (digits.length < 8) return ''
  const greeting = `Hola ${name.trim().replace(/\s+/g, ' ')}, `
  return `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`
}
