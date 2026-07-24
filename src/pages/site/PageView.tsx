/** Página interna genérica servida desde /api/pages/:slug. */
import { useApi } from '../../lib/useApi'
import type { Page } from '../../lib/types'
import { sitePages } from '../../site/nav'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { SiteShell, PageHero, ClosingCta, ConstructionNotice } from './parts'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function PageViewBody({ slug, data, loading }: { slug: string; data: Page | null; loading: boolean }) {
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
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <div className="max-w-2xl">
            {data?.bodyMd ? <Markdown source={data.bodyMd} /> : !loading && <ConstructionNotice />}
          </div>
        </div>
      </section>
      <ClosingCta />
    </SiteShell>
  )
}

export default function PageView({ slug }: { slug: string }) {
  const { data, loading } = useApi<Page>(`/pages/${slug}`)
  return <PageViewBody slug={slug} data={data} loading={loading} />
}
