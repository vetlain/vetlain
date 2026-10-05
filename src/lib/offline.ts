/**
 * Interruptor de sitio suspendido. Con `true`, TODA URL (sitio público y panel
 * /vzgroups) muestra un 404 genérico y el prerender no genera HTML estático, así
 * que tampoco queda contenido real servido antes de que cargue el JS.
 *
 * Es sólo visual: la API sigue funcionando. Para reactivar el sitio basta con
 * volver a `false`, commitear y pushear (Vercel redespliega desde main).
 */
export const SITE_OFFLINE = false
