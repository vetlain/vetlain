import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Header,
  Footer,
  StickyCta,
  Tape,
  WhatsappBtn,
  ChevronGlyph,
  PhoneGlyph,
  TEL_MOVIL,
} from '../site/chrome'
import type { SitePageDef } from '../site/nav'

/**
 * Página interna reutilizable. Vive en su propia URL (bien para SEO) pero el
 * contenido está en construcción: muestra encabezado, descripción y CTAs para
 * que la página siga convirtiendo mientras se completa.
 */
export default function SitePage({ path, kicker, title, description }: SitePageDef) {
  // Al cambiar de página, partir arriba.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  // Migas: los detalles de servicio cuelgan de /servicios.
  const isServicio = path.startsWith('/servicios/')

  return (
    <div className="p3 flex min-h-screen flex-col bg-white text-vetlain-ink">
      <Header />
      <main className="flex-1 pb-14 md:pb-0">
        <section className="relative overflow-hidden bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
            {/* Breadcrumb */}
            <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <Link to="/" className="transition-colors hover:text-vetlain-green-dark">Inicio</Link>
              {isServicio && (
                <>
                  <ChevronGlyph className="h-3.5 w-3.5 text-vetlain-green" />
                  <Link to="/servicios" className="transition-colors hover:text-vetlain-green-dark">Servicios</Link>
                </>
              )}
              <ChevronGlyph className="h-3.5 w-3.5 text-vetlain-green" />
              <span className="text-vetlain-ink">{title}</span>
            </nav>

            <span className="p3-clip-slash mt-6 inline-block bg-vetlain-green-tint px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-vetlain-green-deep">
              {kicker}
            </span>
            <h1 className="p3-display mt-5 text-[clamp(2.4rem,7vw,4.5rem)] uppercase leading-[0.95] text-vetlain-ink">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {description}
            </p>

            {/* Aviso de sección en construcción (borde completo — el DESIGN.md
                de P3 prohíbe los side-stripe; se usa borde 2px + cinta) */}
            <div className="mt-8 flex max-w-xl items-start gap-3 border-2 border-neutral-200 bg-vetlain-green-tint p-5">
              <span className="p3-display mt-0.5 text-2xl leading-none text-vetlain-green-dark" aria-hidden="true">
                //
              </span>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-700">
                Estamos preparando esta sección. Mientras tanto, escríbenos o
                llámanos: te respondemos el mismo día y coordinamos una
                evaluación en terreno sin costo.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsappBtn className="px-6 py-4 text-base">Escríbenos por WhatsApp</WhatsappBtn>
              <a
                href={TEL_MOVIL}
                className="inline-flex items-center justify-center gap-2 border-2 border-vetlain-ink px-6 py-4 text-base font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white"
              >
                <PhoneGlyph className="h-5 w-5" />
                Llamar ahora
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-2 py-4 text-sm font-bold uppercase tracking-wide text-vetlain-green-dark transition-colors hover:text-vetlain-green-deep"
              >
                Volver al inicio
                <ChevronGlyph className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <Tape />
        </section>
      </main>
      <Footer />
      <StickyCta />
    </div>
  )
}
