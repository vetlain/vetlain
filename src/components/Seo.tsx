/**
 * Metadatos SEO por página (react-helmet-async): title, description, canonical,
 * Open Graph y Twitter. Opcionalmente inyecta JSON-LD (structured data).
 *
 * El canonical/URL se calcula desde el dominio actual en el navegador. Cuando
 * se agregue SSR (fase 4b) esto se resolverá también en el servidor.
 */
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Vetlain'
// Dominio canónico (override con VITE_SITE_URL en build). Así el canonical y el
// Open Graph apuntan a vetlain.cl aunque se acceda por la URL de vercel.app.
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://vetlain.cl').replace(/\/$/, '')

export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: {
  title: string
  description?: string
  /** Ruta absoluta desde la raíz, ej: "/servicios". Si se omite, usa la actual. */
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: object | object[]
}) {
  const url =
    SITE_URL + (path ?? (typeof window !== 'undefined' ? window.location.pathname : ''))
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
