import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { FormEvent, ReactNode, SVGProps } from 'react'

// Prefijo de assets públicos (respeta el `base` de Vite: / en dev, /vetlain/ en prod)
const A = import.meta.env.BASE_URL

/* ── Glyphs (schematic, single 1.5 stroke) ──────────────────────────── */

function Glyph(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  const { children, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

const RodentGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M4 16c0-3.3 2.7-6 6-6h1.5a4 4 0 003.4-1.9l.6-1a2 2 0 013.5.1" />
    <path d="M4 16h9a3 3 0 003-3" />
    <circle cx="7.5" cy="7" r="2.2" />
    <path d="M4 16l-1.5 2M8 16l-1 2.5M12 16v2.5" />
    <circle cx="11.2" cy="12.4" r="0.4" fill="currentColor" />
  </Glyph>
)

const InsectGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <ellipse cx="12" cy="13" rx="3.5" ry="5.5" />
    <path d="M12 7.5V4M10 5l2 2M14 5l-2 2" />
    <path d="M8.5 10L5 8M8.5 13H4.5M8.5 16l-3.2 1.8" />
    <path d="M15.5 10L19 8M15.5 13H19.5M15.5 16l3.2 1.8" />
  </Glyph>
)

const BirdGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M4 15.5c3-1 4.5-4.5 7.5-4.5.9 0 1.6.2 2.2.6" />
    <path d="M13.7 11.6c1-2.3 3.2-3.9 5.8-3.9-1 1.6-1.1 2.8-.6 4 -1.2 4-4.8 6.8-9.3 6.8-1.9 0-3.4-.4-4.6-1.1 2 0 3.6-.6 4.6-1.7" />
    <circle cx="17.8" cy="9" r="0.45" fill="currentColor" />
  </Glyph>
)

const CapGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M12 5L2 9.5 12 14l10-4.5L12 5z" />
    <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
  </Glyph>
)

const BuildingGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="4" y="3" width="10" height="18" />
    <rect x="14" y="9" width="6" height="12" />
    <path d="M7 7h2M7 11h2M7 15h2M17 13h0M17 17h0" />
  </Glyph>
)

const LeafGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M4 20c0-8 6-14 16-14 0 10-6 16-14 16" />
    <path d="M6 18C10 14 13 12 18 10" />
  </Glyph>
)

const PhoneGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" />
  </Glyph>
)

const MailGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </Glyph>
)

const PinGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M12 21s7-6.5 7-11.5a7 7 0 10-14 0C5 14.5 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </Glyph>
)

const ClockGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Glyph>
)

const ArrowGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Glyph>
)

const CheckGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M4 12l5 5L20 6" />
  </Glyph>
)

/* ── Data ─────────────────────────────────────────────────────────── */

type CategoryId = 'roedores' | 'insectos' | 'aves'
type GlyphComp = (p: SVGProps<SVGSVGElement>) => ReactNode

const categories: { id: CategoryId; label: string; glyph: GlyphComp }[] = [
  { id: 'roedores', label: 'Roedores', glyph: RodentGlyph },
  { id: 'insectos', label: 'Insectos', glyph: InsectGlyph },
  { id: 'aves', label: 'Aves', glyph: BirdGlyph },
]

const services: { glyph: GlyphComp; title: string; desc: string }[] = [
  { glyph: RodentGlyph, title: 'Control de roedores', desc: 'Desratización preventiva y correctiva con estaciones certificadas y monitoreo permanente.' },
  { glyph: InsectGlyph, title: 'Control de insectos', desc: 'Desinsectación y desinfección con productos de bajo impacto ambiental.' },
  { glyph: BirdGlyph, title: 'Control de aves', desc: 'Sistemas de disuasión y captura para proteger fachadas e infraestructura.' },
  { glyph: CapGlyph, title: 'Capacitaciones', desc: 'Formación en manejo integrado de plagas e higiene para tu equipo.' },
  { glyph: BuildingGlyph, title: 'Servicios especializados', desc: 'Programas a medida para plantas alimentarias, bodegas, oficinas y casinos.' },
  { glyph: LeafGlyph, title: 'Enfoque ambiental', desc: 'Control y mantención con criterios sanitarios y de bajo impacto ecológico.' },
]

const clients = [
  { name: 'Aristía', src: A + 'brand/cliente-aristia.png' },
  { name: 'Brüggen', src: A + 'brand/cliente-bruggen.png' },
  { name: 'Huentelauquén', src: A + 'brand/cliente-huentelauquen.png' },
  { name: 'Pacífico Sur', src: A + 'brand/cliente-pacifico-sur.png' },
  { name: 'Puratos', src: A + 'brand/cliente-puratos.png' },
]

interface Product {
  code: string
  name: string
  desc: string
  cat: CategoryId
}

const products: Product[] = [
  { code: 'R-01', name: 'Ekomille', desc: 'Trampa electrónica de captura múltiple con contador.', cat: 'roedores' },
  { code: 'R-02', name: 'Ekologic', desc: 'Estación de monitoreo digital, sin cebo tóxico.', cat: 'roedores' },
  { code: 'R-03', name: 'EVO', desc: 'Estación de control cerrada, apta para exterior.', cat: 'roedores' },
  { code: 'R-04', name: 'Snap Trap', desc: 'Trampa mecánica de pinza, de acción rápida.', cat: 'roedores' },
  { code: 'R-05', name: 'Nara Lure', desc: 'Atrayente sintético de larga duración.', cat: 'roedores' },
  { code: 'R-06', name: 'Vastrap', desc: 'Placa adhesiva de captura para roedores.', cat: 'roedores' },
  { code: 'R-07', name: 'Mouse Shield', desc: 'Pasta selladora de puntos de acceso.', cat: 'roedores' },
  { code: 'R-08', name: 'Tunap', desc: 'Spray protector repelente de superficies.', cat: 'roedores' },
  { code: 'I-01', name: 'Nice 18/W40', desc: 'Luminaria UV decorativa, captura por adhesivo.', cat: 'insectos' },
  { code: 'I-02', name: 'RB-40', desc: 'Lámpara UV industrial de alto rendimiento.', cat: 'insectos' },
  { code: 'I-03', name: 'Onda', desc: 'Lámpara UV de montaje en techo o pared.', cat: 'insectos' },
  { code: 'I-04', name: 'Blatrap', desc: 'Trampa de monitoreo para cucarachas.', cat: 'insectos' },
  { code: 'I-05', name: 'Blatrap Mini', desc: 'Versión compacta para espacios reducidos.', cat: 'insectos' },
  { code: 'I-06', name: 'Venus Lure', desc: 'Atrayente en polvo de base orgánica.', cat: 'insectos' },
  { code: 'I-07', name: 'XLURE MST', desc: 'Trampa de feromonas multi-especie.', cat: 'insectos' },
  { code: 'A-01', name: 'Trampa Rotatoria', desc: 'Captura viva rotatoria para palomas.', cat: 'aves' },
  { code: 'A-02', name: 'Inox 80/25', desc: 'Púas disuasorias de acero inoxidable.', cat: 'aves' },
]

const filters: { id: CategoryId | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'roedores', label: 'Roedores' },
  { id: 'insectos', label: 'Insectos' },
  { id: 'aves', label: 'Aves' },
]

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

/* ── Header ───────────────────────────────────────────────────────── */

function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center" aria-label="Vetlain, inicio">
          <img
            src={A + 'brand/logo-recortado.png'}
            alt="Vetlain · Control y Mantención Ambiental"
            className="h-10 w-auto"
            width={327}
            height={107}
          />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-vetlain-green-dark"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="rounded-lg bg-vetlain-green-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vetlain-green-deep"
          >
            Solicitar visita
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-neutral-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-vetlain-green-dark px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Solicitar visita
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-20 md:grid-cols-2 lg:gap-16">
        <div>
          <span className="p2-mono inline-flex items-center gap-2 rounded-full border border-vetlain-green/30 bg-vetlain-green-tint px-3 py-1 text-xs font-medium uppercase tracking-wide text-vetlain-green-dark">
            <LeafGlyph className="h-3.5 w-3.5" />
            Control y mantención ambiental
          </span>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-vetlain-ink text-balance">
            Nuestro negocio es mantener el suyo,{' '}
            <span className="text-vetlain-green-dark">sin plagas.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
            Control de roedores, insectos y aves para empresas y hogares del
            sector de Talagante. Certificados ISO 9001, con evaluación en
            terreno antes de cotizar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-lg bg-vetlain-green-dark px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vetlain-green-deep"
            >
              Solicitar evaluación
              <ArrowGlyph className="h-4 w-4" />
            </a>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-3 text-sm font-semibold text-vetlain-ink transition-colors hover:border-vetlain-green hover:text-vetlain-green-dark"
            >
              Ver catálogo
            </a>
          </div>
          <div className="p2-mono mt-8 flex items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wide text-neutral-500 flex-wrap">
            <span>ISO 9001 vigente</span>
            <span className="h-3 w-px bg-neutral-300" />
            <span>17 equipos propios</span>
            <span className="h-3 w-px bg-neutral-300" />
            <span>Talagante y alrededores</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full bg-vetlain-green-tint sm:block" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
            <img
              src={A + 'brand/foto-industria.jpg'}
              alt="Técnico de Vetlain inspeccionando una planta de procesamiento de alimentos"
              className="aspect-[4/3] w-full object-cover"
              width={976}
              height={720}
            />
          </div>
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-md">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vetlain-green-tint text-vetlain-green-dark">
              <CheckGlyph className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-vetlain-ink">Plantas alimentarias</div>
              <div className="text-xs text-neutral-500">bajo norma sanitaria</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Clients / trust ──────────────────────────────────────────────── */

function Clients() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <p className="p2-mono shrink-0 text-xs uppercase tracking-wide text-neutral-500">
            Empresas que confían en Vetlain
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-10">
            {clients.map((c) => (
              <img
                key={c.name}
                src={c.src}
                alt={c.name}
                className="h-8 w-auto max-w-[110px] object-contain opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 sm:h-9"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Services ─────────────────────────────────────────────────────── */

function Services() {
  return (
    <section id="servicios" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-vetlain-ink sm:text-4xl">
            Servicios de control de plagas
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Un programa integral para mantener tu operación protegida durante
            todo el año, no solo cuando aparece el problema.
          </p>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {services.map(({ glyph: G, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 border-t border-neutral-200 py-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-vetlain-green-tint text-vetlain-green-dark">
                <G className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-vetlain-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Catalog (technical index) ────────────────────────────────────── */

function ProductRow({ product, index }: { product: Product; index: number }) {
  const category = categories.find((c) => c.id === product.cat)!
  const CatGlyph = category.glyph
  return (
    <li
      className="p2-row group border-t border-neutral-200"
      style={{ animationDelay: `${Math.min(index * 28, 340)}ms` }}
    >
      <div className="flex items-baseline gap-4 py-5 transition-colors duration-200 group-hover:bg-neutral-50 sm:gap-6 sm:py-6">
        <span className="p2-mono w-12 shrink-0 text-sm font-medium tabular-nums text-vetlain-green-dark sm:w-16 sm:text-[15px]">
          {product.code}
        </span>
        <CatGlyph className="hidden h-6 w-6 shrink-0 -translate-y-0.5 self-center text-neutral-400 transition-colors duration-200 group-hover:text-vetlain-green md:block" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-vetlain-ink sm:text-lg">{product.name}</h3>
          <p className="mt-0.5 max-w-md text-sm leading-relaxed text-neutral-500">{product.desc}</p>
        </div>
      </div>
    </li>
  )
}

function Catalog() {
  const [active, setActive] = useState<CategoryId | 'todos'>('todos')

  const counts = useMemo(() => {
    const base: Record<string, number> = { todos: products.length }
    for (const c of categories) base[c.id] = products.filter((p) => p.cat === c.id).length
    return base
  }, [])

  const groups = useMemo(() => {
    const visible = categories.filter((c) => active === 'todos' || c.id === active)
    return visible.map((c) => ({ category: c, items: products.filter((p) => p.cat === c.id) }))
  }, [active])

  return (
    <section id="catalogo" className="scroll-mt-20 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-vetlain-ink sm:text-4xl">
              Catálogo técnico
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Diecisiete equipos y productos seleccionados para el control
              profesional de roedores, insectos y aves. Cada referencia,
              probada en terreno.
            </p>
          </div>
          <dl className="p2-mono shrink-0 space-y-1.5 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <dt className="tabular-nums text-vetlain-green-dark">17</dt>
              <dd className="uppercase tracking-wide">referencias</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="tabular-nums text-vetlain-green-dark">03</dt>
              <dd className="uppercase tracking-wide">categorías</dd>
            </div>
          </dl>
        </div>

        {/* Filters */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1">
          {filters.map((f) => {
            const isActive = active === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vetlain-green ${
                  isActive ? 'bg-vetlain-green-dark text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {f.label}
                <span className={`p2-mono text-xs tabular-nums ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                  {counts[f.id]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Index */}
        <div className="mt-4">
          {groups.map(({ category, items }) => {
            const CatGlyph = category.glyph
            return (
              <div key={category.id} className="mt-10 first:mt-6">
                <div className="flex items-center gap-3 pb-1">
                  <CatGlyph className="h-5 w-5 text-vetlain-green-dark" />
                  <h3 className="text-sm font-semibold text-vetlain-ink">{category.label}</h3>
                  <span className="p2-mono text-xs tabular-nums text-neutral-500">
                    {items.length.toString().padStart(2, '0')}
                  </span>
                  <span className="ml-1 h-px flex-1 bg-neutral-200" />
                </div>
                <ul key={active}>
                  {items.map((p, i) => (
                    <ProductRow key={p.code} product={p} index={i} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── About ────────────────────────────────────────────────────────── */

const stats = [
  { num: '17', label: 'equipos y productos' },
  { num: '03', label: 'áreas de control' },
  { num: 'ISO', label: '9001 vigente' },
  { num: '+20', label: 'años de oficio' },
]

function About() {
  return (
    <section id="nosotros" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 lg:gap-16">
        <div className="relative order-2 md:order-1">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
            <img
              src={A + 'brand/foto-tecnico.jpg'}
              alt="Técnico de Vetlain realizando control de plagas en terreno"
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-semibold tracking-tight text-vetlain-ink sm:text-4xl">
            Control y mantención ambiental, hecho con oficio
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">
            En Vetlain no vendemos una fumigación puntual: entregamos un
            proceso certificado, documentado y evaluado en terreno antes de
            cotizar. Trabajamos con criterios sanitarios y de bajo impacto
            ambiental, para que proteger tu operación no signifique descuidar
            el entorno.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Evaluación en terreno antes de cotizar, sin costo.',
              'Programas a medida para cada rubro y tamaño.',
              'Equipos y productos certificados, propios del catálogo.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vetlain-green-tint text-vetlain-green-dark">
                  <CheckGlyph className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-neutral-200 pt-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="p2-mono text-2xl font-medium tabular-nums text-vetlain-green-dark">{s.num}</dt>
                <dd className="mt-1 text-xs leading-snug text-neutral-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ── Contact ──────────────────────────────────────────────────────── */

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className="p2-mono mb-1.5 block text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-vetlain-ink placeholder:text-neutral-400 transition-colors focus:border-vetlain-green focus:outline-none focus:ring-2 focus:ring-vetlain-green/30'

function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contacto" className="scroll-mt-20 border-t border-neutral-200 bg-vetlain-green-tint">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 lg:gap-16">
        {/* Info */}
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-vetlain-ink sm:text-4xl">
            Contáctenos y le ayudaremos a la brevedad
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-700">
            Coordinamos una evaluación técnica en terreno, sin costo ni
            compromiso. Llámenos o escríbanos y le respondemos el mismo día.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <PinGlyph className="mt-0.5 h-5 w-5 shrink-0 text-vetlain-green-dark" />
              <span className="text-neutral-700">Juana Canales 987, Talagante</span>
            </li>
            <li className="flex items-start gap-3">
              <PhoneGlyph className="mt-0.5 h-5 w-5 shrink-0 text-vetlain-green-dark" />
              <span className="text-neutral-700">+56 2 2815 3975 · +56 9 6830 2857</span>
            </li>
            <li className="flex items-start gap-3">
              <MailGlyph className="mt-0.5 h-5 w-5 shrink-0 text-vetlain-green-dark" />
              <span className="text-neutral-700">vetlain@vetlain.cl</span>
            </li>
            <li className="flex items-start gap-3">
              <ClockGlyph className="mt-0.5 h-5 w-5 shrink-0 text-vetlain-green-dark" />
              <span className="text-neutral-700">Lun a Vie · 09:00 – 18:00</span>
            </li>
          </ul>

          <div className="mt-8 flex items-center gap-3">
            {['Facebook', 'Instagram', 'YouTube', 'LinkedIn'].map((s) => (
              <span
                key={s}
                className="p2-mono rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-600"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-vetlain-green-tint text-vetlain-green-dark">
                <CheckGlyph className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-vetlain-ink">¡Mensaje enviado!</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Gracias por escribirnos. Un técnico de Vetlain se pondrá en
                contacto a la brevedad.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm font-semibold text-vetlain-green-dark hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nombre" id="c-nombre">
                <input id="c-nombre" name="nombre" type="text" required autoComplete="name" placeholder="Nombre y apellido" className={inputClass} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Correo" id="c-email">
                  <input id="c-email" name="email" type="email" required autoComplete="email" placeholder="tu@correo.cl" className={inputClass} />
                </Field>
                <Field label="Teléfono" id="c-tel">
                  <input id="c-tel" name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 …" className={inputClass} />
                </Field>
              </div>
              <Field label="Mensaje" id="c-msg">
                <textarea id="c-msg" name="mensaje" required rows={4} placeholder="Cuéntanos qué necesitas controlar y dónde." className={`${inputClass} resize-none`} />
              </Field>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-vetlain-green-dark px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vetlain-green-deep"
              >
                Enviar solicitud
                <ArrowGlyph className="h-4 w-4" />
              </button>
              <p className="text-center text-xs text-neutral-500">
                También puedes llamarnos directo al +56 2 2815 3975.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Footer ───────────────────────────────────────────────────────── */

function SiteFooter() {
  return (
    <footer className="bg-vetlain-ink text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <img
            src={A + 'brand/logo-recortado.png'}
            alt="Vetlain"
            className="h-10 w-auto brightness-0 invert"
            width={327}
            height={107}
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            Control y mantención ambiental para empresas y hogares. Certificados
            ISO 9001, en Talagante y alrededores.
          </p>
        </div>

        <div>
          <h3 className="p2-mono text-xs uppercase tracking-wide text-neutral-500">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-neutral-300 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="p2-mono text-xs uppercase tracking-wide text-neutral-500">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li>Juana Canales 987, Talagante</li>
            <li>+56 2 2815 3975</li>
            <li>+56 9 6830 2857</li>
            <li>vetlain@vetlain.cl</li>
          </ul>
        </div>

        <div>
          <h3 className="p2-mono text-xs uppercase tracking-wide text-neutral-500">Redes</h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            {['Facebook', 'Instagram', 'YouTube', 'LinkedIn'].map((s) => (
              <li key={s}>
                <span className="transition-colors hover:text-white">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-neutral-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Vetlain · Control y Mantención Ambiental</span>
          <Link to="/" className="p2-mono uppercase tracking-wide transition-colors hover:text-neutral-300">
            ← Volver al panel de prototipos
          </Link>
        </div>
      </div>
    </footer>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Prototipo2() {
  return (
    <div className="p2 min-h-screen bg-white text-neutral-900">
      <SiteHeader />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Catalog />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
