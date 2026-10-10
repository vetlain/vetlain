/** /pestologia — índice de las plagas que combate Vetlain (contenido en src/site/pests.ts). */
import { Link } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { ChevronGlyph, A } from '../../site/chrome'
import { Reveal } from '../../site/Reveal'
import { pests } from '../../site/pests'
import { sitePages } from '../../site/nav'
import { SiteShell, PageHero, ClosingCta, TrustedClients } from './parts'

export default function PestologiaIndex() {
  const page = sitePages.find((p) => p.path === '/pestologia')!

  return (
    <SiteShell scrollKey="pestologia">
      <Seo
        title="Pestología: conoce las plagas que combatimos"
        description={page.description}
        path="/pestologia"
      />
      <PageHero crumbs={[{ label: page.title }]} kicker={page.kicker} title={page.title} description={page.description} />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pests.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90} className="flex">
                <Link
                  to={`/pestologia/${p.slug}`}
                  className="group flex w-full flex-col overflow-hidden border-2 border-neutral-200 transition-colors hover:border-vetlain-green"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={A + p.photo.src}
                      alt={p.photo.alt}
                      width={960}
                      height={720}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-extrabold uppercase tracking-tight text-vetlain-ink">{p.name}</h2>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-neutral-600">{p.summary}</p>
                    <p className="mt-3 text-xs italic text-neutral-500">
                      {p.species.map((s) => s.sci).join(' · ')}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-vetlain-green-dark">
                      Ver ficha
                      <ChevronGlyph className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-6xl px-5 pb-10 text-xs leading-relaxed text-neutral-500">
        Fotografías: Wikimedia Commons —{' '}
        {pests.map((p, i) => (
          <span key={p.slug}>
            {i > 0 && ' · '}
            <a href={p.photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-vetlain-green-dark">
              {p.photo.credit}
            </a>{' '}
            ({p.photo.license})
          </span>
        ))}
        .
      </p>

      <TrustedClients />
      <ClosingCta />
    </SiteShell>
  )
}
