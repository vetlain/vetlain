import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FormEvent, ReactNode, SVGProps } from 'react'

const WHATSAPP = 'https://wa.me/56968302857'
const TEL_MOVIL = 'tel:+56968302857'
// Prefijo de assets públicos (respeta el `base` de Vite: / en dev, /vetlain/ en prod)
const A = import.meta.env.BASE_URL

/* ── Icons ────────────────────────────────────────────────────────── */

function Glyph(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  const { children, ...rest } = props
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
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
  </Glyph>
)
const SprayGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="8" y="9" width="7" height="12" />
    <path d="M8 9V6h4v3M12 6V4h3" />
    <path d="M18 6h1M18 9h2M19 12h1M18 4h1" />
  </Glyph>
)
const BuildingGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <rect x="4" y="3" width="10" height="18" />
    <rect x="14" y="9" width="6" height="12" />
    <path d="M7 7h2M7 11h2M7 15h2M17 13h0M17 17h0" />
  </Glyph>
)
const ShieldGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Glyph>
)
const PhoneGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" />
  </Glyph>
)
const ArrowGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Glyph>
)
const CheckGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M4 12l5 5L20 6" /></Glyph>
)
const WhatsappGlyph = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 00-8.53 15.25L2 22l4.9-1.42A10 10 0 1012 2zm0 1.7a8.3 8.3 0 11-4.3 15.4l-.3-.18-2.9.84.86-2.83-.2-.3A8.3 8.3 0 0112 3.7z" />
    <path d="M9.3 7.2c-.2-.45-.36-.35-.55-.36l-.47-.01c-.16 0-.43.06-.66.3-.23.25-.87.85-.87 2.08 0 1.23.9 2.42 1.02 2.58.13.17 1.74 2.77 4.3 3.78 2.13.84 2.57.68 3.03.63.46-.04 1.48-.6 1.69-1.19.2-.58.2-1.08.15-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78z" />
  </svg>
)

/* ── Data ─────────────────────────────────────────────────────────── */

type GlyphComp = (p: SVGProps<SVGSVGElement>) => ReactNode

const servicios: { glyph: GlyphComp; title: string; desc: string }[] = [
  { glyph: RodentGlyph, title: 'Ratas y ratones', desc: 'Desratización con estaciones certificadas y sellado de accesos.' },
  { glyph: InsectGlyph, title: 'Insectos y cucarachas', desc: 'Desinsectación de bajo impacto para casa y negocio.' },
  { glyph: BirdGlyph, title: 'Aves', desc: 'Disuasión y captura para fachadas, techos y patios.' },
  { glyph: SprayGlyph, title: 'Desinfección', desc: 'Sanitización de superficies y ambientes de trabajo.' },
  { glyph: BuildingGlyph, title: 'Plantas y bodegas', desc: 'Programas a medida bajo norma sanitaria.' },
  { glyph: ShieldGlyph, title: 'Garantía', desc: 'Trabajo certificado ISO 9001 y con respaldo por escrito.' },
]

const pasos = [
  { n: '01', title: 'Llamas o escribes', desc: 'Nos cuentas qué viste y dónde. Respondemos el mismo día.' },
  { n: '02', title: 'Evaluamos en terreno', desc: 'Vamos, identificamos la plaga y te cotizamos sin costo.' },
  { n: '03', title: 'Eliminamos la plaga', desc: 'Aplicamos el tratamiento y dejamos un plan de control.' },
]

const trust = ['ISO 9001 certificada', 'Respuesta el mismo día', 'Talagante y alrededores', '+20 años de oficio']

/* ── Building blocks ──────────────────────────────────────────────── */

function Tape({ className = '' }: { className?: string }) {
  return <div className={`p3-tape h-3 w-full ${className}`} aria-hidden="true" />
}

function WhatsappBtn({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-hazard-red px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-hazard-red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hazard-yellow ${className}`}
    >
      <WhatsappGlyph className="h-5 w-5" />
      {children}
    </a>
  )
}

/* ── Header ───────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-hazard-yellow bg-hazard-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center" aria-label="Vetlain, inicio">
          <img src={A + 'brand/logo-recortado.png'} alt="Vetlain" className="h-9 w-auto brightness-0 invert" width={327} height={107} />
        </a>
        <div className="flex items-center gap-2">
          <a
            href={TEL_MOVIL}
            className="hidden items-center gap-2 border-2 border-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-hazard-black sm:inline-flex"
          >
            <PhoneGlyph className="h-4 w-4" />
            Llamar
          </a>
          <WhatsappBtn className="px-4 py-2">WhatsApp</WhatsappBtn>
        </div>
      </div>
    </header>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hazard-black">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:py-20 md:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="p3-rise">
          <span className="p3-clip-slash inline-block bg-hazard-yellow px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-hazard-black">
            Control de plagas · Talagante
          </span>
          <h1 className="p3-display mt-5 text-[clamp(2.8rem,9vw,5.5rem)] uppercase leading-[0.92] text-white">
            Plagas fuera.{' '}
            <span className="text-hazard-yellow">rápido y en serio.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
            Ratas, insectos y aves fuera de tu casa o negocio. Evaluación en
            terreno el mismo día, con garantía y certificación ISO 9001.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsappBtn className="px-6 py-4 text-base">Escríbenos por WhatsApp</WhatsappBtn>
            <a
              href={TEL_MOVIL}
              className="inline-flex items-center justify-center gap-2 border-2 border-white px-6 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-hazard-yellow hover:border-hazard-yellow hover:text-hazard-black"
            >
              <PhoneGlyph className="h-5 w-5" />
              Llamar ahora
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-hazard-yellow">
            <ShieldGlyph className="h-4 w-4" />
            Sin costo de visita · cotización al toque
          </p>
        </div>

        {/* Angular photo */}
        <div className="relative p3-rise" style={{ animationDelay: '120ms' }}>
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-hazard-yellow" aria-hidden="true" />
          <div
            className="relative border-2 border-white"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
          >
            <img
              src={A + 'brand/foto-desinsectacion.jpg'}
              alt="Técnico de Vetlain aplicando control de plagas en terreno"
              className="aspect-[4/3] w-full object-cover"
              width={976}
              height={720}
            />
            <div className="absolute inset-0 bg-hazard-black/25" aria-hidden="true" />
          </div>
          <span className="absolute bottom-4 left-0 -translate-x-2 bg-hazard-red px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Respuesta el mismo día
          </span>
        </div>
      </div>
      <Tape />
    </section>
  )
}

/* ── Trust ────────────────────────────────────────────────────────── */

function Trust() {
  return (
    <section className="bg-hazard-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:justify-between">
        {trust.map((t) => (
          <span key={t} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-200 sm:text-sm">
            <CheckGlyph className="h-4 w-4 text-hazard-yellow" />
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}

/* ── Services ─────────────────────────────────────────────────────── */

function Services() {
  return (
    <section id="servicios" className="scroll-mt-20 bg-hazard-black">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-white">
            Qué <span className="text-hazard-red">eliminamos</span>
          </h2>
          <span className="hidden text-sm font-bold uppercase tracking-wide text-neutral-500 sm:block">
            06 servicios
          </span>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(({ glyph: G, title, desc }) => (
            <div
              key={title}
              className="group border-2 border-neutral-800 bg-hazard-ink p-6 transition-colors hover:border-hazard-yellow"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-hazard-yellow text-hazard-black">
                <G className="h-6 w-6" />
              </div>
              <h3 className="p3-display mt-5 text-xl uppercase text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Steps ────────────────────────────────────────────────────────── */

function Steps() {
  return (
    <section className="bg-hazard-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-white">
          Cómo <span className="text-hazard-yellow">trabajamos</span>
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pasos.map((p) => (
            <div key={p.n} className="border-t-2 border-neutral-700 pt-5">
              <span className="p3-clip-tag inline-block bg-hazard-red px-4 py-2 font-bold text-white">
                <span className="p3-display text-2xl">{p.n}</span>
              </span>
              <h3 className="p3-display mt-4 text-xl uppercase text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Urgency band ─────────────────────────────────────────────────── */

function Urgency() {
  return (
    <section className="bg-hazard-red">
      <Tape />
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="p3-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-white">
            No esperes a que<br className="hidden sm:block" /> se multipliquen.
          </h2>
          <p className="mt-3 max-w-lg text-white/90">
            Una plaga chica hoy es una plaga grande en dos semanas. Actúa ahora
            y te respondemos el mismo día.
          </p>
        </div>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 bg-hazard-black px-7 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-hazard-yellow hover:text-hazard-black"
        >
          <WhatsappGlyph className="h-5 w-5" />
          Escríbenos ahora
        </a>
      </div>
      <Tape />
    </section>
  )
}

/* ── Contact ──────────────────────────────────────────────────────── */

const inputClass =
  'w-full border-2 border-neutral-700 bg-hazard-ink px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-hazard-yellow focus:outline-none'

function Contact() {
  const [sent, setSent] = useState(false)
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }
  return (
    <section id="contacto" className="scroll-mt-20 bg-hazard-black">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 md:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-white">
            Contáctanos<br /><span className="text-hazard-yellow">ahora</span>
          </h2>
          <p className="mt-5 max-w-md text-neutral-300">
            La forma más rápida es WhatsApp o teléfono. También puedes dejarnos
            tus datos y te llamamos.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <WhatsappBtn className="px-6 py-4 text-base">Escríbenos por WhatsApp</WhatsappBtn>
            <a
              href={TEL_MOVIL}
              className="inline-flex items-center justify-center gap-2 border-2 border-white px-6 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-hazard-yellow hover:border-hazard-yellow hover:text-hazard-black"
            >
              <PhoneGlyph className="h-5 w-5" />
              +56 9 6830 2857
            </a>
          </div>

          <ul className="mt-8 space-y-2 text-sm text-neutral-400">
            <li>Juana Canales 987, Talagante</li>
            <li>Fijo: +56 2 2815 3975 · vetlain@vetlain.cl</li>
            <li>Lun a Vie · 09:00 – 18:00</li>
          </ul>
        </div>

        <div className="border-2 border-neutral-800 bg-hazard-ink p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center py-6">
              <span className="flex h-12 w-12 items-center justify-center bg-hazard-yellow text-hazard-black">
                <CheckGlyph className="h-6 w-6" />
              </span>
              <h3 className="p3-display mt-4 text-2xl uppercase text-white">¡Recibido!</h3>
              <p className="mt-1 text-sm text-neutral-300">
                Gracias. Te contactamos a la brevedad. Si es urgente, escríbenos
                directo por WhatsApp.
              </p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-bold uppercase tracking-wide text-hazard-yellow hover:underline">
                Enviar otro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="p3-nombre" className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-400">Nombre</span>
                <input id="p3-nombre" name="nombre" type="text" required autoComplete="name" placeholder="Tu nombre" className={inputClass} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="p3-tel" className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-400">Teléfono</span>
                  <input id="p3-tel" name="telefono" type="tel" required autoComplete="tel" placeholder="+56 9 …" className={inputClass} />
                </label>
                <label htmlFor="p3-comuna" className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-400">Comuna</span>
                  <input id="p3-comuna" name="comuna" type="text" placeholder="Talagante…" className={inputClass} />
                </label>
              </div>
              <label htmlFor="p3-msg" className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-400">¿Qué viste?</span>
                <textarea id="p3-msg" name="mensaje" required rows={3} placeholder="Ratones en la cocina, cucarachas en la bodega…" className={`${inputClass} resize-none`} />
              </label>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 bg-hazard-red px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-hazard-red-dark"
              >
                Quiero que me llamen
                <ArrowGlyph className="h-4 w-4" />
              </button>
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
    <footer className="bg-hazard-black">
      <Tape />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <img src={A + 'brand/logo-recortado.png'} alt="Vetlain" className="h-9 w-auto brightness-0 invert" width={327} height={107} />
          <p className="mt-3 max-w-xs text-sm text-neutral-500">
            Control y mantención ambiental · Talagante y alrededores.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Facebook', 'Instagram', 'YouTube', 'LinkedIn'].map((s) => (
            <span key={s} className="border border-neutral-700 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-400">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-xs uppercase tracking-wide text-neutral-500">
          <span>© {new Date().getFullYear()} Vetlain</span>
          <Link to="/" className="font-bold transition-colors hover:text-hazard-yellow">← Panel</Link>
        </div>
      </div>
    </footer>
  )
}

/* ── Sticky mobile CTA ────────────────────────────────────────────── */

function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t-2 border-hazard-yellow md:hidden">
      <a href={TEL_MOVIL} className="flex items-center justify-center gap-2 bg-hazard-black py-3.5 text-sm font-bold uppercase tracking-wide text-white">
        <PhoneGlyph className="h-5 w-5" />
        Llamar
      </a>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-hazard-red py-3.5 text-sm font-bold uppercase tracking-wide text-white">
        <WhatsappGlyph className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function Prototipo3() {
  return (
    <div className="p3 min-h-screen bg-hazard-black text-white">
      <Header />
      <main className="pb-14 md:pb-0">
        <Hero />
        <Trust />
        <Services />
        <Steps />
        <Urgency />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
    </div>
  )
}
