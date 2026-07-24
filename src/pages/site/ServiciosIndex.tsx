/** /servicios — intro editable + grilla de servicios desde la API. */
import { Link } from 'react-router-dom'
import { useApi } from '../../lib/useApi'
import type { Page, Service } from '../../lib/types'
import { Seo } from '../../components/Seo'
import { Tape, ChevronGlyph } from '../../site/chrome'
import { ServiceIcon } from '../../site/service-icons'
import { SiteShell, PageHero, CtaRow, PageState } from './parts'

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function ServiciosIndexBody({
  page,
  services,
  loading,
  error,
}: {
  page: Page | null
  services: Service[] | null
  loading: boolean
  error: string | null
}) {
  const title = page?.title ?? 'Servicios'
  const kicker = page?.kicker ?? 'Control de plagas'
  const description =
    page?.description ??
    'Desratización, desinsectación, control de aves, desinfección y programas para empresas.'

  return (
    <SiteShell scrollKey="servicios">
      <Seo
        title={page?.seoTitle ?? title}
        description={page?.seoDescription ?? description}
        path="/servicios"
      />
      <PageHero crumbs={[{ label: 'Servicios' }]} kicker={kicker} title={title} description={description} />

      <section className="mx-auto max-w-6xl px-5 pb-16">
        {loading && <PageState>Cargando servicios…</PageState>}
        {error && !services && (
          <PageState>No pudimos cargar los servicios. Escríbenos y te ayudamos igual.</PageState>
        )}
        {services && services.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.id}
                to={`/servicios/${s.slug}`}
                className="group flex flex-col border-2 border-neutral-200 p-5 transition-colors hover:border-vetlain-green"
              >
                <ServiceIcon icon={s.icon} className="h-9 w-9 text-vetlain-green-dark" />
                <h2 className="mt-4 text-lg font-extrabold uppercase tracking-tight text-vetlain-ink">
                  {s.title}
                </h2>
                {s.summary && <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-600">{s.summary}</p>}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-vetlain-green-dark">
                  Ver detalle
                  <ChevronGlyph className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
        <CtaRow />
      </section>
      <Tape />
    </SiteShell>
  )
}

export default function ServiciosIndex() {
  const page = useApi<Page>('/pages/servicios')
  const { data: services, loading, error } = useApi<Service[]>('/services')
  return <ServiciosIndexBody page={page.data} services={services} loading={loading} error={error} />
}
