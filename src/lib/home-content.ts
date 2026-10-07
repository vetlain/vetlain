/**
 * Contenido editable de la portada (/).
 *
 * Vive en `site_content` (grupo "home"), una clave por bloque, con el objeto
 * completo del bloque como valor jsonb. Así el panel guarda un bloque entero de
 * una sola vez y el sitio lo lee con el mismo proveedor que ya usa para los
 * datos de contacto.
 *
 * DEFAULT_HOME es la fuente de verdad de los textos actuales: lo usa el seed
 * para poblar la base y el sitio como respaldo mientras carga —o si la API
 * falla—, de modo que la portada nunca aparece vacía.
 *
 * Este módulo es deliberadamente puro (sin React ni JSX): también lo importa el
 * servidor (server/db/seed.ts). El hook para los componentes es `useHomeContent`
 * y vive en site-content.tsx.
 */

/* ── Tipos ───────────────────────────────────────────────────────────── */

/** Encuadre de una foto del carrusel: qué parte queda a la vista al recortarla. */
export type HeroFocus = 'left' | 'center' | 'right'
export type HeroSlide = { image: string; alt: string; focus: HeroFocus }

export type HomeHero = {
  badge: string
  title: string
  titleAccent: string
  text: string
  ctaWhatsapp: string
  ctaCall: string
  note: string
  /** Fotos del carrusel de fondo, en orden. La primera es la que carga primero. */
  slides: HeroSlide[]
  /** Formato antiguo (una sola foto). Solo se lee para migrar filas guardadas
   *  antes del carrusel: ver `withLegacyHeroImage`. El panel ya no lo edita. */
  image?: string
  imageAlt?: string
}

export type ClientLogo = { image: string; name: string }

export type HomeCard = { icon: string; title: string; desc: string }
export type HomeStep = { n: string; title: string; desc: string }

export type HomeContent = {
  seo: { title: string; description: string }
  hero: HomeHero
  trust: { items: string[] }
  clients: {
    visible: boolean
    title: string
    logos: ClientLogo[]
    isoImage: string
    isoText: string
  }
  novedades: { visible: boolean; title: string; titleAccent: string; intro: string }
  services: { title: string; titleAccent: string; note: string; items: HomeCard[] }
  steps: { title: string; titleAccent: string; items: HomeStep[] }
  urgency: { title: string; text: string; cta: string }
  contact: { title: string; titleAccent: string; text: string }
}

/** Bloques que el panel edita y guarda por separado (una clave `home.X` cada uno). */
export const HOME_BLOCKS = [
  'seo',
  'hero',
  'trust',
  'clients',
  'novedades',
  'services',
  'steps',
  'urgency',
  'contact',
] as const
export type HomeBlock = (typeof HOME_BLOCKS)[number]

/** Clave con la que se guarda un bloque en site_content. */
export const homeKey = (block: HomeBlock) => `home.${block}`

/* ── Valores por defecto (los textos actuales del sitio) ─────────────── */

export const DEFAULT_HOME: HomeContent = {
  seo: {
    title: 'Vetlain — Control de plagas en Talagante y alrededores',
    description:
      'Desratización, desinsectación, control de aves y sanitización con certificación ISO 9001. Cobertura en Talagante, Peñaflor, El Monte y comunas vecinas. Respuesta el mismo día.',
  },
  hero: {
    badge: 'Control de plagas · Talagante',
    title: 'Plagas fuera.',
    titleAccent: 'rápido y en serio.',
    text: 'Ratas, insectos y aves fuera de tu casa o negocio. Evaluación en terreno el mismo día, con garantía y certificación ISO 9001.',
    ctaWhatsapp: 'Escríbenos por WhatsApp',
    ctaCall: 'Llamar ahora',
    note: 'Sin costo de visita · cotización al toque',
    slides: [
      {
        image: 'brand/foto-desinsectacion.jpg',
        alt: 'Técnico de Vetlain con traje de protección aplicando control de plagas en una bodega',
        focus: 'center',
      },
      {
        image: 'brand/foto-tecnico.jpg',
        alt: 'Técnico de Vetlain con equipo de aplicación en una planta de procesos',
        focus: 'center',
      },
      {
        image: 'brand/foto-planta-fruta.jpg',
        alt: 'Línea de selección de fruta en una planta alimentaria, con operarios trabajando junto a las cintas',
        focus: 'center',
      },
    ],
  },
  trust: {
    items: [
      'ISO 9001 certificada',
      'Respuesta el mismo día',
      'Talagante y alrededores',
      '+20 años de oficio',
    ],
  },
  clients: {
    visible: true,
    title: 'Empresas que confían en Vetlain',
    logos: [
      { image: 'brand/cliente-aristia.png', name: 'Ariztía' },
      { image: 'brand/cliente-bruggen.png', name: 'Brüggen' },
      { image: 'brand/cliente-huentelauquen.png', name: 'Huentelauquén' },
      { image: 'brand/cliente-pacifico-sur.png', name: 'Pacífico Sur' },
      { image: 'brand/cliente-puratos.png', name: 'Puratos' },
    ],
    isoImage: 'brand/iso-9001.png',
    isoText: 'Certificación ISO 9001:2015',
  },
  novedades: {
    visible: true,
    title: 'Novedades',
    titleAccent: 'de Vetlain',
    intro: 'Lo último del equipo: avisos, campañas de temporada y consejos para mantener tu lugar sin plagas.',
  },
  services: {
    title: 'Qué',
    titleAccent: 'eliminamos',
    note: '06 servicios',
    items: [
      {
        icon: 'rodent',
        title: 'Ratas y ratones',
        desc: 'Instalamos estaciones certificadas en los puntos críticos, sellamos los accesos por donde entran y volvemos a revisar para confirmar que no queden focos activos.',
      },
      {
        icon: 'insect',
        title: 'Insectos y cucarachas',
        desc: 'Cucarachas, hormigas, moscas y pulgas. Aplicamos productos de bajo impacto, seguros para tu familia y mascotas, y atacamos también los nidos que no se ven.',
      },
      {
        icon: 'bird',
        title: 'Aves',
        desc: 'Palomas y otras aves fuera de fachadas, techos y patios. Usamos sistemas de disuasión y exclusión que no dañan la construcción ni lastiman al animal.',
      },
      {
        icon: 'spray',
        title: 'Desinfección',
        desc: 'Sanitización de superficies y ambientes con productos autorizados. Ideal para oficinas, locales y salas de trabajo que necesitan dejar registro del procedimiento.',
      },
      {
        icon: 'building',
        title: 'Plantas y bodegas',
        desc: 'Programas de control continuo diseñados para tu operación, con estaciones mapeadas e informes listos para tus procesos de fiscalización sanitaria.',
      },
      {
        icon: 'shield',
        title: 'Garantía',
        desc: 'Trabajamos bajo norma ISO 9001 y te entregamos todo por escrito: qué aplicamos, dónde y con qué producto, con garantía sobre el trabajo realizado.',
      },
    ],
  },
  steps: {
    title: 'Cómo',
    titleAccent: 'trabajamos',
    items: [
      { n: '01', title: 'Llamas o escribes', desc: 'Nos cuentas qué viste y dónde. Respondemos el mismo día.' },
      { n: '02', title: 'Evaluamos en terreno', desc: 'Vamos, identificamos la plaga y te cotizamos sin costo.' },
      { n: '03', title: 'Eliminamos la plaga', desc: 'Aplicamos el tratamiento y dejamos un plan de control.' },
    ],
  },
  urgency: {
    // El salto de línea se respeta en pantallas medianas y grandes.
    title: 'No esperes a que\nse multipliquen.',
    text: 'Una plaga chica hoy es una plaga grande en dos semanas. Actúa ahora y te respondemos el mismo día.',
    cta: 'Escríbenos ahora',
  },
  contact: {
    title: 'Contáctanos',
    titleAccent: 'ahora',
    text: 'La forma más rápida es WhatsApp o teléfono. También puedes dejarnos tus datos y te llamamos.',
  },
}

/* ── Lectura ─────────────────────────────────────────────────────────── */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/**
 * Combina un bloque guardado con su valor por defecto: los campos presentes en
 * la base mandan, los ausentes (o vacíos) caen al default. Así, si más adelante
 * se agrega un campo nuevo al bloque, las filas antiguas siguen funcionando.
 */
function mergeBlock<T extends object>(defaults: T, value: unknown): T {
  if (!isObject(value)) return defaults
  const out = { ...defaults } as Record<string, unknown>
  for (const [k, v] of Object.entries(value)) {
    if (v === undefined || v === null) continue
    if (!(k in out)) continue // campo desconocido: se ignora
    out[k] = v
  }
  return out as T
}

/**
 * Las filas guardadas antes del carrusel traen una sola foto (`image`) y no
 * `slides`, así que el merge les pone las fotos por defecto. Para no perder la
 * foto que el cliente eligió, va primera; las demás por defecto la siguen.
 */
function withLegacyHeroImage(hero: HomeHero): HomeHero {
  const { image, imageAlt } = hero
  if (!image || hero.slides !== DEFAULT_HOME.hero.slides) return hero
  if (hero.slides.some((s) => s.image === image)) return hero
  return {
    ...hero,
    slides: [{ image, alt: imageAlt ?? '', focus: 'center' }, ...hero.slides],
  }
}

/** Arma el contenido de la portada a partir del mapa de site_content. */
export function buildHomeContent(map: Record<string, unknown>): HomeContent {
  const block = <K extends HomeBlock>(k: K): HomeContent[K] =>
    mergeBlock(DEFAULT_HOME[k] as object, map[homeKey(k)]) as HomeContent[K]
  return {
    seo: block('seo'),
    hero: withLegacyHeroImage(block('hero')),
    trust: block('trust'),
    clients: block('clients'),
    novedades: block('novedades'),
    services: block('services'),
    steps: block('steps'),
    urgency: block('urgency'),
    contact: block('contact'),
  }
}
