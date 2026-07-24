/** Piezas compartidas de las páginas internas del sitio (chrome + hero + cierre). */
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
  children,
}: {
  crumbs?: Crumb[]
  kicker?: string | null
  title: string
  description?: string | null
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:pt-14 sm:pb-10">
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
        <h1 className="p3-display mt-5 text-balance text-[clamp(2.2rem,6vw,4rem)] uppercase leading-[0.95] text-vetlain-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

/** Chips de confianza (para llenar y reforzar el hero de servicios). */
export function TrustChips() {
  const items = ['ISO 9001 certificada', 'Respuesta el mismo día', 'Talagante y alrededores']
  return (
    <ul className="mt-7 flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className="flex items-center gap-2 border-2 border-neutral-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-vetlain-ink"
        >
          <span className="h-2 w-2 bg-vetlain-green" aria-hidden="true" />
          {t}
        </li>
      ))}
    </ul>
  )
}

/** Columna lateral con CTA para las fichas de servicio (llena el vacío + convierte). */
export function ServiceAside() {
  const { telUrl } = useSiteContent()
  const garantias = ['Certificación ISO 9001', 'Productos autorizados', 'Informe y certificado', 'Respaldo por escrito']
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="border-2 border-vetlain-ink bg-white p-6">
        <h2 className="p3-display text-xl uppercase leading-tight text-vetlain-ink">
          Pide tu evaluación
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          En terreno, sin costo. Te cotizamos el mismo día.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <WhatsappBtn className="px-5 py-3.5">Escríbenos por WhatsApp</WhatsappBtn>
          <a
            href={telUrl}
            className="inline-flex items-center justify-center gap-2 border-2 border-vetlain-ink px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white"
          >
            <PhoneGlyph className="h-5 w-5" />
            Llamar ahora
          </a>
        </div>
        <ul className="mt-6 space-y-2.5 border-t-2 border-neutral-100 pt-5">
          {garantias.map((g) => (
            <li key={g} className="flex items-start gap-2.5 text-sm text-neutral-700">
              <span className="mt-1.5 h-2 w-2 shrink-0 bg-vetlain-green" aria-hidden="true" />
              {g}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-neutral-500">
          <Link to="/servicios" className="font-bold uppercase tracking-wide text-vetlain-green-dark hover:text-vetlain-green-deep">
            Ver todos los servicios →
          </Link>
        </p>
      </div>
    </aside>
  )
}

/** Cierre de página: banda verde-tinte con titular + CTAs (reemplaza CTAs sueltas). */
export function ClosingCta({ title = '¿Tienes una plaga? Actúa hoy.' }: { title?: string }) {
  const { telUrl } = useSiteContent()
  return (
    <section className="border-t-2 border-vetlain-green bg-vetlain-green-tint">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="p3-display text-[clamp(1.6rem,4vw,2.5rem)] uppercase leading-[0.95] text-vetlain-ink">
            {title}
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-vetlain-green-deep">
            Evaluación en terreno sin costo · respuesta el mismo día
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <WhatsappBtn className="px-6 py-4 text-base">Escríbenos por WhatsApp</WhatsappBtn>
          <a
            href={telUrl}
            className="inline-flex items-center justify-center gap-2 border-2 border-vetlain-ink px-6 py-4 text-base font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white"
          >
            <PhoneGlyph className="h-5 w-5" />
            Llamar ahora
          </a>
        </div>
      </div>
    </section>
  )
}

/** Aviso "en construcción" (fallback si una página aún no tiene contenido). */
export function ConstructionNotice() {
  return (
    <div className="flex max-w-xl items-start gap-3 border-2 border-neutral-200 bg-vetlain-green-tint p-5">
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
