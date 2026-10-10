/** /pestologia/:slug — ficha de una plaga (contenido en src/site/pests.ts). */
import { Link, useParams } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { ChevronGlyph } from '../../site/chrome'
import { ServiceIcon } from '../../site/service-icons'
import { pests } from '../../site/pests'
import { SiteShell, PageHero, TrustChips, ServiceAside, ClosingCta, PageState } from './parts'

function FactList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="p3-display text-[clamp(1.4rem,3vw,1.9rem)] uppercase leading-[0.95] text-vetlain-ink">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-base leading-relaxed text-neutral-700">
            <span className="mt-2 h-2 w-2 shrink-0 bg-vetlain-green" aria-hidden="true" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Presentación pura: la usan tanto el cliente como el prerender. */
export function PestDetailBody({ slug }: { slug: string }) {
  const pest = pests.find((p) => p.slug === slug)

  if (!pest) {
    return (
      <SiteShell scrollKey={slug}>
        <Seo title="Plaga no encontrada" noindex path={`/pestologia/${slug}`} />
        <PageHero crumbs={[{ label: 'Pestología', to: '/pestologia' }, { label: 'No encontrada' }]} title="No encontrada" />
        <PageState>
          Esta ficha no existe o fue movida.{' '}
          <Link to="/pestologia" className="font-bold text-vetlain-green-dark underline">
            Ver todas las plagas
          </Link>
          .
        </PageState>
      </SiteShell>
    )
  }

  const others = pests.filter((p) => p.slug !== slug)

  return (
    <SiteShell scrollKey={slug}>
      <Seo title={pest.seoTitle} description={pest.seoDescription} path={`/pestologia/${slug}`} />
      <PageHero
        crumbs={[{ label: 'Pestología', to: '/pestologia' }, { label: pest.name }]}
        kicker="Pestología"
        title={pest.name}
        description={pest.summary}
      >
        <TrustChips />
      </PageHero>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
          <div className="max-w-2xl space-y-12">
            <p className="text-pretty text-lg leading-relaxed text-neutral-700">{pest.intro}</p>

            <div>
              <h2 className="p3-display text-[clamp(1.4rem,3vw,1.9rem)] uppercase leading-[0.95] text-vetlain-ink">
                Especies frecuentes
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {pest.species.map((s) => (
                  <li key={s.sci} className="border-2 border-neutral-200 p-4">
                    <p className="font-extrabold uppercase tracking-tight text-vetlain-ink">{s.name}</p>
                    <p className="text-sm italic text-vetlain-green-dark">{s.sci}</p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <FactList title="Señales de alerta" items={pest.signs} />
            <FactList title="Riesgos" items={pest.risks} />
            <FactList title="Cómo prevenir" items={pest.prevention} />

            <Link
              to={pest.service.to}
              className="group flex items-center justify-between gap-4 border-2 border-vetlain-green bg-vetlain-green-tint p-5 transition-colors hover:bg-vetlain-green hover:text-white"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-widest text-vetlain-green-deep group-hover:text-white">
                  El servicio que lo resuelve
                </span>
                <span className="p3-display mt-1 block text-2xl uppercase leading-none text-vetlain-ink group-hover:text-white">
                  {pest.service.label}
                </span>
              </span>
              <ChevronGlyph className="h-6 w-6 shrink-0 text-vetlain-green-dark transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          </div>
          <ServiceAside />
        </div>
      </section>

      <section className="border-t-2 border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="p3-display text-[clamp(1.4rem,3vw,1.9rem)] uppercase leading-[0.95] text-vetlain-ink">
            Otras plagas
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((p) => (
              <li key={p.slug} className="flex">
                <Link
                  to={`/pestologia/${p.slug}`}
                  className="group flex w-full items-center gap-3 border-2 border-neutral-200 p-4 transition-colors hover:border-vetlain-green"
                >
                  <ServiceIcon icon={p.icon} className="h-7 w-7 shrink-0 text-vetlain-green-dark" />
                  <span className="text-sm font-extrabold uppercase tracking-tight text-vetlain-ink">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </SiteShell>
  )
}

export default function PestDetail() {
  const { slug = '' } = useParams()
  return <PestDetailBody slug={slug} />
}
