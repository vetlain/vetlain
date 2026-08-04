/**
 * /novedades/:slug — novedad con entrada propia.
 *
 * Sólo existen las del modo "entry" (las de modo "link" llevan a otra página y
 * no tienen URL propia). Mismo formato que una entrada del blog, pero vuelve a
 * la portada: las novedades no tienen índice aparte, se listan en el home.
 */
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { News } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { assetUrl } from '../../site/chrome'
import { formatDay } from '../../lib/format'
import { SiteShell, PageHero, ClosingCta, PageState } from './parts'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function NewsDetailBody({ slug, data }: { slug: string; data: News | null }) {
  if (!data) {
    return (
      <SiteShell scrollKey={slug}>
        <Seo title="Novedad no encontrada" noindex path={`/novedades/${slug}`} />
        <PageHero
          crumbs={[{ label: 'Novedades', to: '/#novedades' }, { label: 'No encontrada' }]}
          title="No encontrada"
        />
        <PageState>
          Esta novedad no existe o fue movida.{' '}
          <Link to="/" className="font-bold text-vetlain-green-dark underline">
            Volver al inicio
          </Link>
          .
        </PageState>
      </SiteShell>
    )
  }

  const img = assetUrl(data.image)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    description: data.excerpt ?? undefined,
    image: img ?? undefined,
    datePublished: data.date ?? undefined,
    dateModified: data.updatedAt,
    author: { '@type': 'Organization', name: 'Vetlain' },
    publisher: { '@type': 'Organization', name: 'Vetlain' },
  }

  return (
    <SiteShell scrollKey={slug}>
      <Seo
        title={data.seoTitle ?? data.title}
        description={data.seoDescription ?? data.excerpt ?? undefined}
        path={`/novedades/${slug}`}
        image={img ?? undefined}
        type="article"
        jsonLd={jsonLd}
      />
      <PageHero
        crumbs={[{ label: 'Novedades', to: '/#novedades' }, { label: data.title }]}
        kicker={data.date ? formatDay(data.date) : 'Novedades'}
        title={data.title}
        description={data.excerpt}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-16">
          {img && (
            <div className="mb-10 max-w-3xl pr-2.5">
              <img
                src={img}
                alt=""
                loading="lazy"
                className="w-full border-2 border-vetlain-ink shadow-[10px_10px_0_0_#3d8b40]"
              />
            </div>
          )}
          <article className="max-w-2xl">
            <Markdown source={data.bodyMd ?? ''} />
          </article>

          <div className="mt-12 max-w-2xl border-t-2 border-neutral-100 pt-6">
            <Link
              to="/#novedades"
              className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-vetlain-green-dark transition-colors hover:text-vetlain-green-deep"
            >
              ← Volver a novedades
            </Link>
          </div>
        </div>
      </section>

      <ClosingCta title="¿Necesitas ayuda con una plaga?" />
    </SiteShell>
  )
}

export default function NewsDetail() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useApi<News>(`/news/${slug}`)

  if (loading) {
    return (
      <SiteShell scrollKey={slug}>
        <PageState>Cargando…</PageState>
      </SiteShell>
    )
  }

  return <NewsDetailBody slug={slug} data={error ? null : data} />
}
