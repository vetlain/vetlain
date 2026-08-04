/** Tipos compartidos entre el panel y la API (espejo de las filas de la BD). */

export type SiteContentRow = {
  key: string
  value: unknown
  label: string | null
  group: string | null
  updatedAt: string
}

export type Page = {
  id: number
  slug: string
  title: string
  kicker: string | null
  description: string | null
  bodyMd: string | null
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
}

export type Service = {
  id: number
  slug: string
  title: string
  kicker: string | null
  summary: string | null
  bodyMd: string | null
  icon: string | null
  sortOrder: number
  published: boolean
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
}

/** Categorías del catálogo de productos (espejo del validador de la API). */
export type ProductCategory = 'roedores' | 'insectos' | 'aves'

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string; heading: string }[] = [
  { id: 'roedores', label: 'Control Roedores', heading: 'Control de Roedores' },
  { id: 'insectos', label: 'Control Insectos', heading: 'Control de Insectos' },
  { id: 'aves', label: 'Control Aves', heading: 'Control de Aves' },
]

export type Product = {
  id: number
  slug: string
  name: string
  category: ProductCategory
  summary: string | null
  bodyMd: string | null
  image: string | null
  sortOrder: number
  published: boolean
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
}

export type BlogPost = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  bodyMd: string
  coverImage: string | null
  status: 'draft' | 'published'
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Cómo se comporta una novedad:
 *  - 'link'  → la tarjeta lleva a una página que ya existe (o a una URL externa).
 *  - 'entry' → la novedad es una entrada propia, con página en /novedades/:slug.
 */
export type NewsMode = 'link' | 'entry'

/** Novedad de la portada (tarjeta entre el hero y "Qué eliminamos"). */
export type News = {
  id: number
  mode: NewsMode
  title: string
  excerpt: string | null
  image: string | null
  link: string | null
  linkLabel: string | null
  slug: string | null
  bodyMd: string | null
  seoTitle: string | null
  seoDescription: string | null
  /** Fecha simple 'YYYY-MM-DD' (sin hora). */
  date: string | null
  sortOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

/** A dónde lleva la tarjeta de una novedad; null si no lleva a ninguna parte. */
export function newsHref(n: News): string | null {
  if (n.mode === 'entry') return n.slug ? `/novedades/${n.slug}` : null
  return n.link || null
}

export type Lead = {
  id: number
  name: string
  phone: string
  comuna: string | null
  message: string | null
  handled: boolean
  createdAt: string
}

export type AdminUser = { email: string }
