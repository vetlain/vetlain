/** Página interna genérica servida desde /api/pages/:slug. */
import { useApi } from '../../lib/useApi'
import type { Page } from '../../lib/types'
import { sitePages } from '../../site/nav'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { Tape } from '../../site/chrome'
import { SiteShell, PageHero, CtaRow, ConstructionNotice } from './parts'

export default function PageView({ slug }: { slug: string }) {
  const { data, loading } = useApi<Page>(`/pages/${slug}`)

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
      <section className="mx-auto max-w-3xl px-5 pb-16">
        {data?.bodyMd ? (
          <Markdown source={data.bodyMd} />
        ) : (
          !loading && <ConstructionNotice />
        )}
        <CtaRow />
      </section>
      <Tape />
    </SiteShell>
  )
}
