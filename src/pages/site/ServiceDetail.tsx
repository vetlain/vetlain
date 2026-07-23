/** /servicios/:slug — ficha de servicio desde la API. */
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { Service } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Markdown } from '../../components/Markdown'
import { Tape } from '../../site/chrome'
import { SiteShell, PageHero, CtaRow, ConstructionNotice, PageState } from './parts'

export default function ServiceDetail() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useApi<Service>(`/services/${slug}`)

  if (loading) {
    return (
      <SiteShell scrollKey={slug}>
        <PageState>Cargando…</PageState>
      </SiteShell>
    )
  }

  if (error || !data) {
    return (
      <SiteShell scrollKey={slug}>
        <Seo title="Servicio no encontrado" noindex path={`/servicios/${slug}`} />
        <PageHero crumbs={[{ label: 'Servicios', to: '/servicios' }, { label: 'No encontrado' }]} title="No encontrado" />
        <PageState>
          Este servicio no existe o fue movido.{' '}
          <Link to="/servicios" className="font-bold text-vetlain-green-dark underline">
            Ver todos los servicios
          </Link>
          .
        </PageState>
      </SiteShell>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.summary ?? undefined,
    serviceType: data.title,
    areaServed: 'Talagante, Región Metropolitana, Chile',
    provider: { '@type': 'LocalBusiness', name: 'Vetlain' },
  }

  return (
    <SiteShell scrollKey={slug}>
      <Seo
        title={data.seoTitle ?? data.title}
        description={data.seoDescription ?? data.summary ?? undefined}
        path={`/servicios/${slug}`}
        jsonLd={jsonLd}
      />
      <PageHero
        crumbs={[{ label: 'Servicios', to: '/servicios' }, { label: data.title }]}
        kicker={data.kicker}
        title={data.title}
        description={data.summary}
      />
      <section className="mx-auto max-w-3xl px-5 pb-16">
        {data.bodyMd ? <Markdown source={data.bodyMd} /> : <ConstructionNotice />}
        <CtaRow />
      </section>
      <Tape />
    </SiteShell>
  )
}
