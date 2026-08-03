/** /productos/:slug — ficha de producto desde la API. */
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { Product } from '../../lib/types'
import { PRODUCT_CATEGORIES } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { assetUrl } from '../../site/chrome'
import { SiteShell, PageHero, ServiceAside, ClosingCta, PageState } from './parts'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function ProductDetailBody({ slug, data }: { slug: string; data: Product | null }) {
  if (!data) {
    return (
      <SiteShell scrollKey={slug}>
        <Seo title="Producto no encontrado" noindex path={`/productos/${slug}`} />
        <PageHero
          crumbs={[{ label: 'Productos', to: '/productos' }, { label: 'No encontrado' }]}
          title="No encontrado"
        />
        <PageState>
          Este producto no existe o fue movido.{' '}
          <Link to="/productos" className="font-bold text-vetlain-green-dark underline">
            Ver todo el catálogo
          </Link>
          .
        </PageState>
      </SiteShell>
    )
  }

  const category = PRODUCT_CATEGORIES.find((c) => c.id === data.category)
  const img = assetUrl(data.image)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.summary ?? undefined,
    category: category?.heading,
    brand: { '@type': 'Brand', name: 'Vetlain' },
  }

  return (
    <SiteShell scrollKey={slug}>
      <Seo
        title={data.seoTitle ?? data.name}
        description={data.seoDescription ?? data.summary ?? undefined}
        path={`/productos/${slug}`}
        jsonLd={jsonLd}
      />
      <PageHero
        crumbs={[{ label: 'Productos', to: '/productos' }, { label: data.name }]}
        kicker={category?.heading ?? 'Producto'}
        title={data.name}
        description={data.summary}
      />

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
          <div className="max-w-2xl">
            {img && (
              <div className="mb-8 flex items-center justify-center border-2 border-neutral-200 bg-neutral-50 p-8">
                <img src={img} alt={data.name} className="max-h-80 w-auto object-contain" />
              </div>
            )}
            {data.bodyMd && <Markdown source={data.bodyMd} />}
            <p className="mt-8 border-t-2 border-neutral-100 pt-5 text-xs">
              <Link
                to={`/productos#${data.category}`}
                className="font-bold uppercase tracking-wide text-vetlain-green-dark hover:text-vetlain-green-deep"
              >
                ← Ver todos los productos de {category?.heading ?? 'esta categoría'}
              </Link>
            </p>
          </div>
          <ServiceAside />
        </div>
      </section>

      <ClosingCta title="¿Te interesa este producto?" />
    </SiteShell>
  )
}

export default function ProductDetail() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useApi<Product>(`/products/${slug}`)

  if (loading) {
    return (
      <SiteShell scrollKey={slug}>
        <PageState>Cargando…</PageState>
      </SiteShell>
    )
  }

  return <ProductDetailBody slug={slug} data={error ? null : data} />
}
