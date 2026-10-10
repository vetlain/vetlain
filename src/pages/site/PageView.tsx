/** Página interna genérica servida desde /api/pages/:slug. */
import { useApi } from '../../lib/useApi'
import type { Page } from '../../lib/types'
import { sitePages } from '../../site/nav'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { SiteShell, PageHero, ClosingCta, ConstructionNotice, AboutPillars } from './parts'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function PageViewBody({
  slug,
  data,
  loading,
  coverage = null,
}: {
  slug: string
  data: Page | null
  loading: boolean
  /** Sólo /nosotros: la página "cobertura" (editable en el panel) va al final. */
  coverage?: Page | null
}) {
  // Fallback: los datos que ya viven en nav.ts, por si la API aún no responde.
  const fallback = sitePages.find((p) => p.path === `/${slug}`)
  const title = data?.title ?? fallback?.title ?? 'Vetlain'
  const kicker = data?.kicker ?? fallback?.kicker ?? null
  const description = data?.description ?? fallback?.description ?? undefined

  return (
    <SiteShell scrollKey={slug}>
      <Seo
        title={data?.seoTitle ?? title}
        description={data?.seoDescription ?? description}
        path={`/${slug}`}
      />
      <PageHero crumbs={[{ label: title }]} kicker={kicker} title={title} description={description} />
      {/* Bloque institucional fijo, sólo en /nosotros y antes del cuerpo editable. */}
      {slug === 'nosotros' && <AboutPillars />}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <div className="max-w-2xl">
            {data?.bodyMd ? <Markdown source={data.bodyMd} /> : !loading && <ConstructionNotice />}
          </div>
        </div>
      </section>
      {slug === 'nosotros' && <CoverageSection data={coverage} />}
      <ClosingCta />
    </SiteShell>
  )
}

/**
 * Zonas de cobertura, al cierre de /nosotros (antes era su propia página; la
 * URL /cobertura redirige aquí, al ancla #cobertura). El texto sigue saliendo
 * de la página "cobertura" del panel.
 */
function CoverageSection({ data }: { data: Page | null }) {
  const fallback = sitePages.find((p) => p.path === '/cobertura')
  const kicker = data?.kicker ?? fallback?.kicker
  const title = data?.title ?? fallback?.title ?? 'Zonas de cobertura'
  const description = data?.description ?? fallback?.description
  return (
    <section id="cobertura" className="scroll-mt-20 border-t-2 border-neutral-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        {kicker && (
          <span className="p3-clip-slash inline-block bg-vetlain-green-tint px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-vetlain-green-deep">
            {kicker}
          </span>
        )}
        <h2 className="p3-display mt-5 text-[clamp(1.8rem,4.5vw,3rem)] uppercase leading-[0.95] text-vetlain-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">{description}</p>
        )}
        {data?.bodyMd && (
          <div className="mt-8 max-w-2xl">
            <Markdown source={data.bodyMd} />
          </div>
        )}
      </div>
    </section>
  )
}

export default function PageView({ slug }: { slug: string }) {
  const { data, loading } = useApi<Page>(`/pages/${slug}`)
  const coverage = useApi<Page>(slug === 'nosotros' ? '/pages/cobertura' : null)
  return <PageViewBody slug={slug} data={data} loading={loading} coverage={coverage.data} />
}
