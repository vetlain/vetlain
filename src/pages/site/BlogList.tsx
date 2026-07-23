/** /blog — listado de entradas publicadas desde la API. */
import { Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { Page, BlogPost } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Tape, ChevronGlyph } from '../../site/chrome'
import { SiteShell, PageHero, PageState } from './parts'
import { formatDate } from '../../lib/format'

export default function BlogList() {
  const page = useApi<Page>('/pages/blog')
  const { data: posts, loading, error } = useApi<BlogPost[]>('/blog')

  const title = page.data?.title ?? 'Blog'
  const kicker = page.data?.kicker ?? 'Guías y consejos'
  const description =
    page.data?.description ??
    'Cómo prevenir plagas en casa y negocio, señales de alerta y buenas prácticas de sanitización.'

  return (
    <SiteShell scrollKey="blog">
      <Seo title={page.data?.seoTitle ?? title} description={page.data?.seoDescription ?? description} path="/blog" />
      <PageHero crumbs={[{ label: 'Blog' }]} kicker={kicker} title={title} description={description} />

      <section className="mx-auto max-w-4xl px-5 pb-16">
        {loading && <PageState>Cargando entradas…</PageState>}
        {error && !posts && <PageState>No pudimos cargar el blog en este momento.</PageState>}
        {posts && posts.length === 0 && <PageState>Pronto publicaremos nuestras primeras guías.</PageState>}
        {posts && posts.length > 0 && (
          <ul className="space-y-4">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="group flex flex-col gap-4 border-2 border-neutral-200 p-5 transition-colors hover:border-vetlain-green sm:flex-row"
                >
                  {p.coverImage && (
                    <img
                      src={p.coverImage}
                      alt=""
                      className="h-40 w-full shrink-0 object-cover sm:h-28 sm:w-44"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0">
                    {p.publishedAt && (
                      <time className="text-xs font-bold uppercase tracking-wide text-vetlain-green-dark">
                        {formatDate(p.publishedAt)}
                      </time>
                    )}
                    <h2 className="mt-1 text-lg font-extrabold uppercase tracking-tight text-vetlain-ink">
                      {p.title}
                    </h2>
                    {p.excerpt && <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{p.excerpt}</p>}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-vetlain-green-dark">
                      Leer más
                      <ChevronGlyph className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Tape />
    </SiteShell>
  )
}
