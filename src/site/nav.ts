/**
 * Navegación del sitio Vetlain (Prototipo 3, sitio en producción).
 * Fuente única de verdad: la usan el Header, el Footer y las rutas de App.
 * Las páginas internas están vacías por ahora (placeholder) pero cada una
 * vive en su propia URL para SEO; se irán llenando más adelante.
 */

export type NavItem = { label: string; to: string }

/** Navegación principal (barra superior). */
export const mainNav: NavItem[] = [
  { label: 'Servicios', to: '/servicios' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Cobertura', to: '/cobertura' },
  { label: 'Blog', to: '/blog' },
]

/** Columnas de enlaces del footer (profundidad para SEO interno). */
export const footerGroups: { title: string; links: NavItem[] }[] = [
  {
    title: 'Servicios',
    links: [
      { label: 'Desratización', to: '/servicios/desratizacion' },
      { label: 'Desinsectación', to: '/servicios/desinsectacion' },
      { label: 'Control de aves', to: '/servicios/control-de-aves' },
      { label: 'Desinfección y sanitización', to: '/servicios/desinfeccion' },
      { label: 'Empresas y bodegas', to: '/servicios/empresas' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Nosotros', to: '/nosotros' },
      { label: 'Zonas de cobertura', to: '/cobertura' },
      { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contacto', to: '/contacto' },
    ],
  },
]

/** Redes sociales. `href: '#'` es placeholder: reemplazar por la URL real
 *  del perfil (y añadir target/rel de enlace externo) cuando existan. */
export type SocialName = 'facebook' | 'instagram' | 'linkedin' | 'youtube'
export const socialLinks: { name: SocialName; label: string; href: string }[] = [
  { name: 'facebook', label: 'Facebook', href: '#' },
  { name: 'instagram', label: 'Instagram', href: '#' },
  { name: 'linkedin', label: 'LinkedIn', href: '#' },
  { name: 'youtube', label: 'YouTube', href: '#' },
]

/** Páginas internas (placeholder). Cada una genera una ruta en App. */
export type SitePageDef = {
  path: string
  kicker: string
  title: string
  description: string
}

export const sitePages: SitePageDef[] = [
  {
    path: '/servicios',
    kicker: 'Control de plagas',
    title: 'Servicios',
    description:
      'Desratización, desinsectación, control de aves, desinfección y programas para empresas. Cobertura en Talagante y alrededores con certificación ISO 9001.',
  },
  {
    path: '/nosotros',
    kicker: 'Quiénes somos',
    title: 'Nosotros',
    description:
      'Más de 20 años controlando plagas en la zona poniente de Santiago. Equipo certificado, trabajo con respaldo por escrito y respuesta el mismo día.',
  },
  {
    path: '/cobertura',
    kicker: 'Dónde trabajamos',
    title: 'Zonas de cobertura',
    description:
      'Talagante, Peñaflor, El Monte, Isla de Maipo, Padre Hurtado y comunas vecinas. Consulta por tu sector y te confirmamos disponibilidad el mismo día.',
  },
  {
    path: '/blog',
    kicker: 'Guías y consejos',
    title: 'Blog',
    description:
      'Cómo prevenir plagas en casa y negocio, señales de alerta tempranas y buenas prácticas de sanitización.',
  },
  {
    path: '/contacto',
    kicker: 'Hablemos',
    title: 'Contacto',
    description:
      'Escríbenos por WhatsApp o llámanos. Evaluación en terreno sin costo y cotización el mismo día.',
  },
  {
    path: '/preguntas-frecuentes',
    kicker: 'Resolvemos tus dudas',
    title: 'Preguntas frecuentes',
    description:
      '¿Es seguro para mascotas y niños? ¿Cuánto demora el tratamiento? ¿Entregan certificado? Aquí respondemos lo más consultado.',
  },
  {
    path: '/servicios/desratizacion',
    kicker: 'Servicio',
    title: 'Desratización',
    description:
      'Eliminación y control de ratas y ratones con estaciones certificadas, sellado de accesos y monitoreo posterior.',
  },
  {
    path: '/servicios/desinsectacion',
    kicker: 'Servicio',
    title: 'Desinsectación',
    description:
      'Control de cucarachas, hormigas, moscas y otros insectos con productos de bajo impacto para casa y negocio.',
  },
  {
    path: '/servicios/control-de-aves',
    kicker: 'Servicio',
    title: 'Control de aves',
    description:
      'Disuasión, exclusión y captura de aves en fachadas, techos y patios, sin dañar la infraestructura.',
  },
  {
    path: '/servicios/desinfeccion',
    kicker: 'Servicio',
    title: 'Desinfección y sanitización',
    description:
      'Sanitización de superficies y ambientes de trabajo con protocolo certificado y productos autorizados.',
  },
  {
    path: '/servicios/empresas',
    kicker: 'Servicio',
    title: 'Empresas y bodegas',
    description:
      'Programas de control de plagas a medida bajo norma sanitaria para plantas, bodegas y locales comerciales.',
  },
]
