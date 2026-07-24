/** /blog/:slug — entrada del blog desde la API. */
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { BlogPost as Post } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { SiteShell, PageHero, ClosingCta, PageState } from './parts'
import { formatDate } from '../../lib/format'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function BlogPostBody({ slug, data }: { slug: string; data: Post | null }) {
  if (!data) {
    return (
      <SiteShell scrollKey={slug}>
        <Seo title="Entrada no encontrada" noindex path={`/blog/${slug}`} />
        <PageHero crumbs={[{ label: 'Blog', to: '/blog' }, { label: 'No encontrada' }]} title="No encontrada" />
        <PageState>
          Esta entrada no existe o fue movida.{' '}
          <Link to="/blog" className="font-bold text-vetlain-green-dark underline">
            Volver al blog
          </Link>
          .
        </PageState>
      </SiteShell>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.excerpt ?? undefined,
    image: data.coverImage ?? undefined,
    datePublished: data.publishedAt ?? undefined,
    dateModified: data.updatedAt,
    author: { '@type': 'Organization', name: 'Vetlain' },
    publisher: { '@type': 'Organization', name: 'Vetlain' },
  }

  return (
    <SiteShell scrollKey={slug}>
      <Seo
        title={data.seoTitle ?? data.title}
        description={data.seoDescription ?? data.excerpt ?? undefined}
        path={`/blog/${slug}`}
        image={data.coverImage ?? undefined}
        type="article"
        jsonLd={jsonLd}
      />
      <PageHero
        crumbs={[{ label: 'Blog', to: '/blog' }, { label: data.title }]}
        kicker={data.publishedAt ? formatDate(data.publishedAt) : 'Blog'}
        title={data.title}
        description={data.excerpt}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-16">
          {data.coverImage && (
            <div className="mb-10 max-w-3xl pr-2.5">
              <img
                src={data.coverImage}
                alt=""
                loading="lazy"
                className="w-full border-2 border-vetlain-ink shadow-[10px_10px_0_0_#3d8b40]"
              />
            </div>
          )}
          <article className="max-w-2xl">
            <Markdown source={data.bodyMd} />
          </article>

          <div className="mt-12 max-w-2xl border-t-2 border-neutral-100 pt-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-vetlain-green-dark transition-colors hover:text-vetlain-green-deep"
            >
              ← Volver al blog
            </Link>
          </div>
        </div>
      </section>

      <ClosingCta title="¿Necesitas ayuda con una plaga?" />
    </SiteShell>
  )
}

export default function BlogPost() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useApi<Post>(`/blog/${slug}`)

  if (loading) {
    return (
      <SiteShell scrollKey={slug}>
        <PageState>Cargando…</PageState>
      </SiteShell>
    )
  }

  return <BlogPostBody slug={slug} data={error ? null : data} />
}
