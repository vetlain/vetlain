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
