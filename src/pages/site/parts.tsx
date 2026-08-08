/** Piezas compartidas de las páginas internas del sitio (chrome + hero + cierre). */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ReactElement, ReactNode, SVGProps } from 'react'
import {
  Header,
  Footer,
  StickyCta,
  WhatsappBtn,
  ChevronGlyph,
  PhoneGlyph,
  CartGlyph,
  Glyph,
  Tape,
  A,
} from '../../site/chrome'
import { useSiteContent } from '../../lib/site-content'

/**
 * Envoltorio con encabezado, pie y CTA fijo. Al cambiar de página hace scroll
 * arriba, salvo que la URL traiga un ancla (p. ej. /productos#roedores), en
 * cuyo caso salta a esa sección.
 */
export function SiteShell({ scrollKey, children }: { scrollKey?: string; children: ReactNode }) {
  const { hash } = useLocation()
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [scrollKey, hash])
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

/**
 * Encabezado de página: migas + kicker + título + descripción.
 * Con `aside` el bloque de texto pasa a media columna y la pieza recibida se
 * coloca a su derecha (bajo el texto en móvil). Sin `aside`, layout de siempre.
 */
export function PageHero({
  crumbs = [],
  kicker,
  title,
  description,
  aside,
  children,
}: {
  crumbs?: Crumb[]
  kicker?: string | null
  title: string
  description?: string | null
  aside?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* p3-rise replica en las páginas internas la entrada del hero de la
          portada: cada navegación remonta el componente y el ascenso se repite,
          haciendo de transición de página. Es CSS puro: corre igual sin JS. */}
      <div className="p3-rise mx-auto max-w-6xl px-5 pt-10 pb-8 sm:pt-14 sm:pb-10">
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

        <div className={aside ? 'gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start' : undefined}>
          <div>
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
          {aside && <div className="mt-9 lg:mt-6">{aside}</div>}
        </div>
      </div>
    </section>
  )
}

/** Tienda online: el catálogo comprable vive fuera del sitio. */
export const STORE_URL = 'https://vzgroups.com/ols/products'

/**
 * Tarjeta de tienda, al costado del título en /productos. En carbón sobre el
 * hero blanco para que corte de inmediato, con la cinta de marca arriba y el
 * botón de compra como pieza dominante.
 */
export function StoreCta() {
  return (
    <a
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Compra los productos del catálogo en la tienda online (se abre en vzgroups.com)"
      className="p3-store-card group block border-2 border-vetlain-ink bg-vetlain-ink text-white transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vetlain-green motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <Tape className="p3-tape-shift" />
      <div className="p-6">
        <p className="p3-display text-[1.7rem] uppercase leading-[0.95]">Compra en línea</p>
        <p className="mt-2.5 text-sm leading-relaxed text-neutral-300">
          Los mismos productos de este catálogo, disponibles para comprar directo.
        </p>

        <span className="mt-6 flex items-center gap-3 bg-vetlain-green px-4 py-3.5 text-left text-sm font-bold uppercase leading-snug tracking-wide text-white transition-colors duration-200 group-hover:bg-white group-hover:text-vetlain-green-deep">
          <CartGlyph className="h-5 w-5 shrink-0" />
          <span className="flex-1">Compra los productos del catálogo aquí</span>
          <ChevronGlyph className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
        </span>

        <span className="mt-3 block text-[0.7rem] font-bold uppercase tracking-widest text-neutral-400">
          Se abre en vzgroups.com ↗
        </span>
      </div>
    </a>
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

/* ── Secciones estáticas de /servicios (traídas del sitio original) ───────
 * Estas tres secciones NO se editan desde el panel: son contenido fijo del
 * sitio antiguo que el cliente pidió mantener tal cual. Para cambiarlas hay que
 * tocar este archivo. */

/** Iconos de los pilares (viven aquí porque no se usan en ningún otro lado). */
const BadgeGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="M9.6 9.2l1.7 1.7 3.2-3.2" />
    <path d="M8.4 13.6L7 21l5-2.4 5 2.4-1.4-7.4" />
  </Glyph>
)

const LeafGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M20 4c0 9-5.2 13-10 13a5.6 5.6 0 01-5.7-5.7C4.3 7 9.5 4 20 4z" />
    <path d="M4 20c1.5-4.5 4.6-8 9-10" />
  </Glyph>
)

const RiseGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M3 20h18" />
    <path d="M4 15.5l5-5 3.5 3.5L20 6" />
    <path d="M15.5 6H20v4.5" />
  </Glyph>
)

const TargetGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 12h.01" />
  </Glyph>
)

const EyeGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
    <circle cx="12" cy="12" r="3" />
  </Glyph>
)

const FlagGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M5.5 21V3.5" />
    <path d="M5.5 4.2h11.8l-2.2 3.9 2.2 3.9H5.5" />
  </Glyph>
)

type Pillar = {
  soft: string
  strong: string
  text: string
  glyph: (p: SVGProps<SVGSVGElement>) => ReactElement
}

/** Tarjeta con cabecera en el color primario. La comparten los dos bloques. */
function PillarCards({ items, className = '' }: { items: Pillar[]; className?: string }) {
  return (
    <div className={`mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-3 ${className}`}>
      {items.map(({ glyph: G, ...p }) => (
        <article key={p.strong} className="flex flex-col border-2 border-vetlain-ink bg-white">
          {/* Cabecera en el color primario: es lo que da el énfasis */}
          <header className="flex items-start justify-between gap-3 bg-vetlain-green-dark px-5 py-4">
            <div className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                {p.soft}
              </span>
              <h2 className="p3-display mt-1 text-2xl uppercase leading-none text-white">{p.strong}</h2>
            </div>
            <G className="h-8 w-8 shrink-0 text-white/60" />
          </header>
          <p className="flex-1 px-5 py-5 text-sm leading-relaxed text-neutral-600">{p.text}</p>
        </article>
      ))}
    </div>
  )
}

/** Los tres pilares del sitio original ("Técnicos CERTIFICADOS", etc.). */
export function ServicePillars() {
  return (
    <section className="bg-white">
      <PillarCards
        className="pb-16"
        items={[
          {
            soft: 'Técnicos',
            strong: 'Certificados',
            text: 'Nuestro equipo de trabajo ha sido cuidadosamente capacitado en el trabajo de excelencia y seguro.',
            glyph: BadgeGlyph,
          },
          {
            soft: 'El mejor',
            strong: 'Servicio',
            text: 'Todos los productos con los que trabajamos priorizan la seguridad del entorno.',
            glyph: LeafGlyph,
          },
          {
            soft: 'Mejora',
            strong: 'Continua',
            text: 'Trabajamos bajo las normas de la ISO 9001 - 2015 que nos obliga a funcionar ordenada y sistemáticamente.',
            glyph: RiseGlyph,
          },
        ]}
      />
    </section>
  )
}

/**
 * Misión, visión y objetivo de /nosotros. Estático a propósito: son la
 * declaración institucional de la empresa, no contenido de campaña, así que no
 * cuelga del panel. Va antes del cuerpo editable de la página.
 */
export function AboutPillars() {
  return (
    <section className="bg-white">
      <PillarCards
        className="pb-14"
        items={[
          {
            soft: 'Nuestra',
            strong: 'Misión',
            text: 'Proteger la salud, el patrimonio y la tranquilidad de nuestros clientes mediante un manejo integrado de plagas eficaz, seguro para las personas y respetuoso con el medio ambiente, entregando siempre un servicio cercano, puntual y documentado.',
            glyph: TargetGlyph,
          },
          {
            soft: 'Nuestra',
            strong: 'Visión',
            text: 'Ser la empresa de control y mantención ambiental de mayor confianza de la zona poniente de Santiago: la que los hogares recomiendan a sus vecinos y la que las empresas eligen cuando el estándar sanitario no admite improvisación.',
            glyph: EyeGlyph,
          },
          {
            soft: 'Nuestro',
            strong: 'Objetivo',
            text: 'Que cada cliente deje de preocuparse por las plagas. No perseguimos una visita puntual, sino un ambiente controlado en el tiempo: diagnosticar el origen, eliminar el problema y dejar instalado un plan de prevención que evite que vuelva.',
            glyph: FlagGlyph,
          },
        ]}
      />
    </section>
  )
}

/** Rubros y espacios donde trabajamos (las 6 tarjetas del sitio original). */
export function ServiceSectors() {
  const sectors = [
    { label: 'Espacios Comunes', img: 'brand/sectores/espacios-comunes.jpg' },
    { label: 'Bodegas', img: 'brand/sectores/bodegas.jpg' },
    { label: 'Oficinas', img: 'brand/sectores/oficinas.jpg' },
    { label: 'Control Externo de Plagas', img: 'brand/sectores/control-externo.jpg' },
    { label: 'Plantas Alimentarias', img: 'brand/sectores/plantas-alimentarias.jpg' },
    { label: 'Casinos', img: 'brand/sectores/casinos.gif' },
  ]
  return (
    <section className="border-t-2 border-neutral-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="p3-display text-[clamp(1.6rem,4vw,2.5rem)] uppercase leading-[0.95] text-vetlain-ink">
          Dónde trabajamos
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Atendemos hogares, comunidades y empresas: desde espacios comunes hasta plantas
          alimentarias con exigencias sanitarias.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <li key={s.label} className="group relative overflow-hidden border-2 border-neutral-200">
              <img
                src={A + s.img}
                alt={s.label}
                loading="lazy"
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vetlain-ink/90 to-transparent px-4 pb-3 pt-10">
                <span className="text-sm font-extrabold uppercase tracking-wide text-white">{s.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** "Han confiado en nosotros": logos de clientes. Estático, no editable. */
export function TrustedClients() {
  const clients = [
    { name: 'Aristía', src: 'brand/cliente-aristia.png' },
    { name: 'Brüggen', src: 'brand/cliente-bruggen.png' },
    { name: 'Huentelauquén', src: 'brand/cliente-huentelauquen.png' },
    { name: 'Pacífico Sur', src: 'brand/cliente-pacifico-sur.png' },
    { name: 'Puratos', src: 'brand/cliente-puratos.png' },
  ]
  return (
    <section className="border-t-2 border-neutral-100 bg-vetlain-green-tint/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
        <div className="text-center">
          <span className="p3-clip-slash inline-block bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-vetlain-green-deep">
            Clientes
          </span>
          <h2 className="p3-display mt-6 text-[clamp(1.9rem,5vw,3rem)] uppercase leading-[0.95] text-vetlain-ink">
            Han confiado en nosotros
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-600">
            Empresas e instituciones que mantienen sus instalaciones libres de plagas con
            nuestros programas de control periódico.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((c) => (
            <li
              key={c.name}
              className="flex h-32 items-center justify-center border-2 border-neutral-200 bg-white p-6 transition-colors hover:border-vetlain-green sm:h-36"
            >
              <img
                src={A + c.src}
                alt={c.name}
                loading="lazy"
                className="max-h-full w-auto max-w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
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
