/** Piezas compartidas de las páginas internas del sitio (chrome + hero + CTAs). */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  Header,
  Footer,
  StickyCta,
  WhatsappBtn,
  ChevronGlyph,
  PhoneGlyph,
} from '../../site/chrome'
import { useSiteContent } from '../../lib/site-content'

/** Envoltorio con encabezado, pie y CTA fijo; hace scroll arriba al cambiar. */
export function SiteShell({ scrollKey, children }: { scrollKey?: string; children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [scrollKey])
  return (
    <div className="p3 flex min-h-screen flex-col bg-white text-vetlain-ink">
      <Header />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer />
      <StickyCta />
    </div>
  )
}

export type Crumb = { label: string; to?: string }

/** Encabezado de página: migas + kicker + título + descripción. */
export function PageHero({
  crumbs = [],
  kicker,
  title,
  description,
}: {
  crumbs?: Crumb[]
  kicker?: string | null
  title: string
  description?: string | null
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <nav
          aria-label="Migas de pan"
          className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500"
        >
          <Link to="/" className="transition-colors hover:text-vetlain-green-dark">
            Inicio
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronGlyph className="h-3.5 w-3.5 text-vetlain-green" />
              {c.to ? (
                <Link to={c.to} className="transition-colors hover:text-vetlain-green-dark">
                  {c.label}
                </Link>
              ) : (
                <span className="text-vetlain-ink">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {kicker && (
          <span className="p3-clip-slash mt-6 inline-block bg-vetlain-green-tint px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-vetlain-green-deep">
            {kicker}
          </span>
        )}
        <h1 className="p3-display mt-5 text-[clamp(2.2rem,6vw,4rem)] uppercase leading-[0.95] text-vetlain-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

/** Bloque de CTAs (WhatsApp + llamar + volver). Cierra el contenido de página. */
export function CtaRow({ back = true }: { back?: boolean }) {
  const { telUrl } = useSiteContent()
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
      <WhatsappBtn className="px-6 py-4 text-base">Escríbenos por WhatsApp</WhatsappBtn>
      <a
        href={telUrl}
        className="inline-flex items-center justify-center gap-2 border-2 border-vetlain-ink px-6 py-4 text-base font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white"
      >
        <PhoneGlyph className="h-5 w-5" />
        Llamar ahora
      </a>
      {back && (
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-2 py-4 text-sm font-bold uppercase tracking-wide text-vetlain-green-dark transition-colors hover:text-vetlain-green-deep"
        >
          Volver al inicio
          <ChevronGlyph className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

/** Aviso "en construcción" (fallback si una página aún no tiene contenido). */
export function ConstructionNotice() {
  return (
    <div className="mt-8 flex max-w-xl items-start gap-3 border-2 border-neutral-200 bg-vetlain-green-tint p-5">
      <span className="p3-display mt-0.5 text-2xl leading-none text-vetlain-green-dark" aria-hidden="true">
        //
      </span>
      <p className="max-w-xl text-sm leading-relaxed text-neutral-700">
        Estamos preparando esta sección. Mientras tanto, escríbenos o llámanos: te
        respondemos el mismo día y coordinamos una evaluación en terreno sin costo.
      </p>
    </div>
  )
}

/** Estado de carga / error a pantalla de página. */
export function PageState({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 text-center text-sm text-neutral-500">{children}</div>
  )
}
