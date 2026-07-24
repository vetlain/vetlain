/** /blog/:slug — entrada del blog desde la API. */
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { BlogPost as Post } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { Tape } from '../../site/chrome'
import { SiteShell, PageHero, CtaRow, PageState } from './parts'
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
      <article className="mx-auto max-w-3xl px-5 pb-16">
        {data.coverImage && (
          <img src={data.coverImage} alt="" className="mb-8 w-full object-cover" loading="lazy" />
        )}
        <Markdown source={data.bodyMd} />
        <CtaRow />
      </article>
      <Tape />
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
