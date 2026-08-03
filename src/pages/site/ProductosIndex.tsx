/** /productos — catálogo agrupado por categoría, servido desde la API. */
import { Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { Page, Product } from '../../lib/types'
import { PRODUCT_CATEGORIES } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { ChevronGlyph, assetUrl } from '../../site/chrome'
import { SiteShell, PageHero, ClosingCta, PageState } from './parts'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function ProductosIndexBody({
  page,
  products,
  loading,
  error,
}: {
  page: Page | null
  products: Product[] | null
  loading: boolean
  error: string | null
}) {
  const title = page?.title ?? 'Productos'
  const kicker = page?.kicker ?? 'Catálogo'
  const description =
    page?.description ??
    'Equipos y dispositivos para el control de roedores, insectos y aves: trampas ecológicas, estaciones de control, lámparas UV, atrayentes y sistemas anti-aves.'

  const groups = PRODUCT_CATEGORIES.map((c) => ({
    ...c,
    items: (products ?? []).filter((p) => p.category === c.id),
  })).filter((g) => g.items.length > 0)

  return (
    <SiteShell scrollKey="productos">
      <Seo
        title={page?.seoTitle ?? title}
        description={page?.seoDescription ?? description}
        path="/productos"
      />
      <PageHero crumbs={[{ label: 'Productos' }]} kicker={kicker} title={title} description={description}>
        {groups.length > 0 && (
          <nav aria-label="Categorías de producto" className="mt-7 flex flex-wrap gap-2">
            {groups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="border-2 border-neutral-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:border-vetlain-green hover:text-vetlain-green-dark"
              >
                {g.label}
              </a>
            ))}
          </nav>
        )}
      </PageHero>

      {page?.bodyMd && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 pb-10">
            <div className="max-w-2xl">
              <Markdown source={page.bodyMd} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-16">
          {loading && <PageState>Cargando productos…</PageState>}
          {error && !products && (
            <PageState>No pudimos cargar el catálogo. Escríbenos y te ayudamos igual.</PageState>
          )}

          {groups.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-24 pt-4 first:pt-0">
              <h2 className="p3-display mb-6 mt-8 text-[clamp(1.6rem,4vw,2.5rem)] uppercase leading-[0.95] text-vetlain-ink first:mt-0">
                {g.heading}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((p) => {
                  const img = assetUrl(p.image)
                  return (
                    <Link
                      key={p.id}
                      to={`/productos/${p.slug}`}
                      className="group flex flex-col border-2 border-neutral-200 transition-colors hover:border-vetlain-green"
                    >
                      {img && (
                        <div className="flex h-44 items-center justify-center border-b-2 border-neutral-100 bg-neutral-50 p-4">
                          <img
                            src={img}
                            alt={p.name}
                            loading="lazy"
                            className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-extrabold uppercase tracking-tight text-vetlain-ink">
                          {p.name}
                        </h3>
                        {p.summary && (
                          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-600">{p.summary}</p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-vetlain-green-dark">
                          Ver detalle
                          <ChevronGlyph className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ClosingCta title="¿Necesitas alguno de estos productos?" />
    </SiteShell>
  )
}

export default function ProductosIndex() {
  const page = useApi<Page>('/pages/productos')
  const { data: products, loading, error } = useApi<Product[]>('/products')
  return <ProductosIndexBody page={page.data} products={products} loading={loading} error={error} />
}
