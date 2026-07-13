import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FormEvent, ReactNode, SVGProps } from 'react'

// Prefijo de assets públicos (respeta el `base` de Vite: / en dev, /vetlain/ en prod)
const A = import.meta.env.BASE_URL

/* ── Icons (stroke-based, 1.75px, consistent set) ───────────────────── */

function Icon(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  const { children, ...rest } = props
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

const ShieldCheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></Icon>
)
const PawIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <ellipse cx="12" cy="16" rx="4.5" ry="3.5" />
    <ellipse cx="6" cy="10" rx="1.6" ry="2.1" /><ellipse cx="10" cy="7" rx="1.6" ry="2.1" />
    <ellipse cx="14" cy="7" rx="1.6" ry="2.1" /><ellipse cx="18" cy="10" rx="1.6" ry="2.1" />
  </Icon>
)
const BugIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <ellipse cx="12" cy="13" rx="4" ry="6" /><path d="M12 7V4M9 5l1.5 2M15 5l-1.5 2" />
    <path d="M8 10l-3-1.5M8 14l-3 1.5M16 10l3-1.5M16 14l3 1.5" /><path d="M9.5 9.5h5" />
  </Icon>
)
const BirdIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 15c3-1 4-4 7-4 1 0 1.8.3 2.4.8" />
    <path d="M13.4 11.8c1-2.3 3.1-3.8 5.6-3.8-1 1.6-1.1 2.7-.6 3.9-1.2 3.9-4.6 6.6-9 6.6-1.8 0-3.3-.4-4.4-1.1 1.9 0 3.4-.6 4.4-1.6" />
    <circle cx="17.5" cy="9.2" r="0.4" fill="currentColor" />
  </Icon>
)
const CapIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 5L2 9.5 12 14l10-4.5L12 5z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /></Icon>
)
const BuildingIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="4" y="3" width="10" height="18" /><rect x="14" y="9" width="6" height="12" /><path d="M7 7h2M7 11h2M7 15h2M17 13h0M17 17h0" /></Icon>
)
const SprayIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="8" y="9" width="7" height="12" rx="1" /><path d="M8 9V6h4v3M12 6V4h3" /><path d="M18 6h1M18 9h2M19 12h1" /></Icon>
)
const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.3-4.3" /></Icon>
)
const ClipboardIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="6" y="4" width="12" height="17" rx="1.5" /><path d="M9 4V3h6v1" /><path d="M9 10h6M9 14h4" /></Icon>
)
const RefreshIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M20 11a8 8 0 00-14-4.5L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0014 4.5L20 16" /><path d="M20 20v-4h-4" /></Icon>
)
const PhoneIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M5 4h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" /></Icon>
)
const MailIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></Icon>
)
const MapPinIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M12 21s7-6.5 7-11.5a7 7 0 10-14 0C5 14.5 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></Icon>
)
const ClockIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Icon>
)
const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M4 12l5 5L20 6" /></Icon>
)
const ArrowRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
)

/* ── Data ─────────────────────────────────────────────────────────── */

type GlyphComp = (p: SVGProps<SVGSVGElement>) => ReactNode

const servicios: { icon: GlyphComp; title: string; desc: string }[] = [
  { icon: PawIcon, title: 'Control de roedores', desc: 'Enfoque preventivo y químico-mecánico, con estaciones de monitoreo y control certificado.' },
  { icon: BugIcon, title: 'Control de insectos', desc: 'Desinsectación y desinfección con soluciones prioritariamente naturales.' },
  { icon: BirdIcon, title: 'Control de aves', desc: 'Métodos especializados de disuasión para proteger infraestructura.' },
  { icon: CapIcon, title: 'Capacitaciones', desc: 'Identificación temprana y prevención de enfermedades para tu equipo.' },
  { icon: BuildingIcon, title: 'Servicios especializados', desc: 'Bodegas, oficinas, plantas alimentarias y casinos, bajo norma sanitaria.' },
  { icon: SprayIcon, title: 'Desinfección y sanitización', desc: 'Tratamiento de superficies y ambientes con control de bajo impacto.' },
]

const industrias = [
  'Plantas alimentarias',
  'Bodegas y centros logísticos',
  'Oficinas y espacios comunes',
  'Casinos y restaurantes',
]

const proceso: { icon: GlyphComp; n: string; title: string; desc: string }[] = [
  { icon: SearchIcon, n: '01', title: 'Diagnóstico', desc: 'Inspección y evaluación en terreno para identificar focos y riesgos.' },
  { icon: ClipboardIcon, n: '02', title: 'Plan a medida', desc: 'Programa de control ajustado a tu rubro, normativa y presupuesto.' },
  { icon: ShieldCheckIcon, n: '03', title: 'Ejecución certificada', desc: 'Aplicación con productos y equipos propios, bajo protocolo ISO 9001.' },
  { icon: RefreshIcon, n: '04', title: 'Monitoreo y reportes', desc: 'Seguimiento periódico y documentación auditable de cada visita.' },
]

const diferenciales = [
  'Certificación ISO 9001 vigente',
  'Catálogo de 17 productos y equipos propios',
  'Evaluación en terreno antes de cotizar',
  'Cobertura en Talagante y alrededores',
]

const stats = [
  { num: '+20', label: 'años de oficio' },
  { num: '17', label: 'equipos y productos' },
  { num: 'ISO', label: '9001 vigente' },
  { num: '100%', label: 'evaluación en terreno' },
]

const clients = [
  { name: 'Aristía', src: A + 'brand/cliente-aristia.png' },
  { name: 'Brüggen', src: A + 'brand/cliente-bruggen.png' },
  { name: 'Huentelauquén', src: A + 'brand/cliente-huentelauquen.png' },
  { name: 'Pacífico Sur', src: A + 'brand/cliente-pacifico-sur.png' },
  { name: 'Puratos', src: A + 'brand/cliente-puratos.png' },
]

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#industrias', label: 'Industrias' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

/* ── Header ───────────────────────────────────────────────────────── */

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#top" className="flex items-center" aria-label="Vetlain, inicio">
          <img src={A + 'brand/logo-recortado.png'} alt="Vetlain · Control y Mantención Ambiental" className="h-10 w-auto" width={327} height={107} />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-vetlain-blue">
              {l.label}
            </a>
          ))}
          <a href="#contacto" className="rounded-lg bg-vetlain-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-vetlain-blue-dark">
            Solicitar cotización
          </a>
        </nav>
        <button
          type="button" onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Abrir menú" aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {l.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setOpen(false)} className="mt-1 rounded-lg bg-vetlain-blue px-3 py-2.5 text-center text-sm font-semibold text-white">
              Solicitar cotización
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
    <section id="top" className="border-b border-slate-200 bg-vetlain-bg">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 sm:py-20 md:grid-cols-2 lg:gap-16">
        <div className="p1-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-vetlain-blue/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-vetlain-blue">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Empresa certificada ISO 9001
          </span>
          <h1 className="p1-display mt-5 text-4xl font-bold leading-[1.05] text-vetlain-blue-dark sm:text-5xl text-balance">
            Nuestro negocio es mantener el suyo,{' '}
            <span className="text-vetlain-blue">sin plagas.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            Control de roedores, insectos y aves para empresas que no pueden
            permitirse errores: plantas alimentarias, bodegas, oficinas y
            espacios comunes en Talagante y alrededores.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#contacto" className="inline-flex items-center gap-2 rounded-lg bg-vetlain-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-vetlain-blue-dark">
              Pedir evaluación en terreno
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#servicios" className="text-sm font-semibold text-vetlain-blue-dark hover:text-vetlain-blue">
              Ver servicios
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span>+20 años de oficio</span>
            <span className="h-3 w-px bg-slate-300" />
            <span>Cobertura Talagante</span>
            <span className="h-3 w-px bg-slate-300" />
            <span>Sin costo de visita</span>
          </div>
        </div>

        <div className="relative p1-rise" style={{ animationDelay: '120ms' }}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <img src={A + 'brand/foto-industria.jpg'} alt="Técnico de Vetlain inspeccionando una planta de procesamiento de alimentos" className="aspect-[4/3] w-full object-cover" width={976} height={720} />
          </div>
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vetlain-blue/10 text-vetlain-blue">
              <ShieldCheckIcon className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-vetlain-blue-dark">Norma sanitaria</div>
              <div className="text-xs text-slate-500">plantas, bodegas y casinos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Clients ──────────────────────────────────────────────────────── */

function Clients() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Empresas que confían en Vetlain
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-10">
            {clients.map((c) => (
              <img key={c.name} src={c.src} alt={c.name} loading="lazy"
                className="h-8 w-auto max-w-[110px] object-contain opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 sm:h-9" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section heading helper ───────────────────────────────────────── */

function SectionKicker({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-wide text-vetlain-blue">{children}</p>
}

/* ── Services ─────────────────────────────────────────────────────── */

function Services() {
  return (
    <section id="servicios" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <SectionKicker>Servicios</SectionKicker>
          <h2 className="p1-display mt-2 text-3xl font-bold tracking-tight text-vetlain-blue-dark sm:text-4xl">
            Control de plagas de punta a punta
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Un programa integral que protege tu operación durante todo el año,
            no solo cuando aparece el problema.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(({ icon: ServiceIcon, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-vetlain-blue/40 hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-vetlain-blue/10 text-vetlain-blue">
                <ServiceIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Industries ───────────────────────────────────────────────────── */

function Industries() {
  return (
    <section id="industrias" className="scroll-mt-20 border-y border-slate-200 bg-vetlain-bg">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectionKicker>Industrias</SectionKicker>
        <h2 className="p1-display mt-2 text-2xl font-bold tracking-tight text-vetlain-blue-dark sm:text-3xl">
          Trabajamos bajo el estándar que exige cada rubro
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industrias.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3.5">
              <BuildingIcon className="h-5 w-5 shrink-0 text-vetlain-blue" />
              <span className="text-sm font-medium text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Process ──────────────────────────────────────────────────────── */

function Process() {
  return (
    <section id="proceso" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <SectionKicker>Cómo trabajamos</SectionKicker>
          <h2 className="p1-display mt-2 text-3xl font-bold tracking-tight text-vetlain-blue-dark sm:text-4xl">
            Un método certificado, no una fumigación puntual
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {proceso.map(({ icon: StepIcon, n, title, desc }) => (
            <div key={n} className="border-t-2 border-slate-200 pt-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vetlain-blue/10 text-vetlain-blue">
                  <StepIcon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold tabular-nums text-vetlain-blue">{n}</span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── About ────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="nosotros" className="scroll-mt-20 border-y border-slate-200 bg-vetlain-bg">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 lg:gap-16">
        <div className="relative order-2 md:order-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <img src={A + 'brand/foto-tecnico.jpg'} alt="Técnico de Vetlain realizando control de plagas en terreno" className="aspect-[4/5] w-full object-cover sm:aspect-[4/3]" loading="lazy" />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <SectionKicker>Por qué Vetlain</SectionKicker>
          <h2 className="p1-display mt-2 text-3xl font-bold tracking-tight text-vetlain-blue-dark sm:text-4xl">
            Confianza que se puede auditar
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            No vendemos una fumigación puntual: entregamos un proceso
            certificado, documentado y evaluado en terreno antes de cotizar,
            para que la decisión sea tuya con toda la información.
          </p>
          <ul className="mt-6 space-y-3">
            {diferenciales.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vetlain-blue/10 text-vetlain-blue">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="p1-display text-2xl font-bold text-vetlain-blue">{s.num}</dt>
                <dd className="mt-1 text-xs leading-snug text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ── CTA band (image bg) ──────────────────────────────────────────── */

function CtaBand() {
  return (
    <section className="relative overflow-hidden">
      <img src={A + 'brand/foto-desinsectacion.jpg'} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-vetlain-blue-dark/85" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="p1-display text-2xl font-bold tracking-tight text-white sm:text-3xl text-balance">
            Protege tu operación antes de que la plaga sea un problema
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
            Coordinamos una evaluación en terreno sin costo ni compromiso, con
            informe y recomendaciones por escrito.
          </p>
        </div>
        <a href="#contacto" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-vetlain-blue-dark shadow-sm transition hover:bg-slate-100">
          Solicitar cotización
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}

/* ── Contact ──────────────────────────────────────────────────────── */

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-vetlain-blue focus:outline-none focus:ring-2 focus:ring-vetlain-blue/25'

function Contact() {
  const [sent, setSent] = useState(false)
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }
  return (
    <section id="contacto" className="scroll-mt-20 bg-vetlain-blue-dark">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="p1-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contáctenos y le ayudaremos a la brevedad
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Déjenos sus datos y un especialista coordinará una evaluación en
            terreno, sin costo ni compromiso.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-white/80">
            <li className="flex items-start gap-3"><MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/50" /><span>Juana Canales 987, Talagante</span></li>
            <li className="flex items-start gap-3"><PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/50" /><span>+56 2 2815 3975 · +56 9 6830 2857</span></li>
            <li className="flex items-start gap-3"><MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/50" /><span>vetlain@vetlain.cl</span></li>
            <li className="flex items-start gap-3"><ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-white/50" /><span>Lun a Vie · 09:00 – 18:00</span></li>
          </ul>
          <a href="tel:+56228153975" className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            <PhoneIcon className="h-4 w-4" />
            Llamar ahora
          </a>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-vetlain-blue/10 text-vetlain-blue">
                <CheckIcon className="h-6 w-6" />
              </span>
              <h3 className="p1-display mt-4 text-lg font-bold text-vetlain-blue-dark">Solicitud enviada</h3>
              <p className="mt-1 text-sm text-slate-600">
                Gracias por escribirnos. Un especialista de Vetlain se pondrá en
                contacto a la brevedad.
              </p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-vetlain-blue hover:underline">
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="p1-nombre" className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</span>
                  <input id="p1-nombre" name="nombre" type="text" required autoComplete="name" placeholder="Nombre y apellido" className={inputClass} />
                </label>
                <label htmlFor="p1-empresa" className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Empresa</span>
                  <input id="p1-empresa" name="empresa" type="text" placeholder="Tu empresa" className={inputClass} />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="p1-email" className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Correo</span>
                  <input id="p1-email" name="email" type="email" required autoComplete="email" placeholder="tu@empresa.cl" className={inputClass} />
                </label>
                <label htmlFor="p1-tel" className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Teléfono</span>
                  <input id="p1-tel" name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 …" className={inputClass} />
                </label>
              </div>
              <label htmlFor="p1-msg" className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mensaje</span>
                <textarea id="p1-msg" name="mensaje" required rows={4} placeholder="Cuéntanos qué necesitas controlar y en qué tipo de instalación." className={`${inputClass} resize-none`} />
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-vetlain-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-vetlain-blue-dark">
                Solicitar cotización
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <p className="text-center text-xs text-slate-500">Respondemos el mismo día hábil.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Footer ───────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-vetlain-blue-dark">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <img src={A + 'brand/logo-recortado.png'} alt="Vetlain" className="h-10 w-auto brightness-0 invert" width={327} height={107} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            Control de plagas certificado para empresas. ISO 9001, en Talagante
            y alrededores.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}><a href={l.href} className="text-white/70 transition-colors hover:text-white">{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>Juana Canales 987, Talagante</li>
            <li>+56 2 2815 3975</li>
            <li>vetlain@vetlain.cl</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Redes</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {['Facebook', 'Instagram', 'YouTube', 'LinkedIn'].map((s) => (
              <li key={s}><span className="transition-colors hover:text-white">{s}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Vetlain · Control y Mantención Ambiental</span>
          <Link to="/" className="uppercase tracking-wide transition-colors hover:text-white/80">← Volver al panel de prototipos</Link>
        </div>
      </div>
    </footer>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Prototipo1() {
  return (
    <div className="p1 min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Hero />
        <Clients />
        <Services />
        <Industries />
        <Process />
        <About />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
