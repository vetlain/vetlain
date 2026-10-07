/**
 * Portada del sitio (/). Todo su contenido es editable desde el panel:
 *  - Textos, imagen del hero, tarjetas y franjas → site_content, grupo "home"
 *    (ver src/lib/home-content.ts y /vzgroups/portada).
 *  - Novedades → tabla `news` (/api/news).
 *
 * `Prototipo3Body` es la presentación pura, con las novedades ya cargadas: la
 * usan tanto el cliente (tras el fetch) como el script de prerender.
 */
import { useEffect, useState } from 'react'
import type { FormEvent, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { useSiteContent, useHomeContent } from '../lib/site-content'
import { useApi } from '../lib/useApi'
import { formatDay } from '../lib/format'
import type { News } from '../lib/types'
import { newsHref } from '../lib/types'
import type { HomeContent, HeroFocus, HeroSlide } from '../lib/home-content'
import { ServiceIcon } from '../site/service-icons'
import { Reveal } from '../site/Reveal'
import {
  WHATSAPP,
  Glyph,
  PhoneGlyph,
  WhatsappGlyph,
  Tape,
  WhatsappBtn,
  Header,
  Footer,
  StickyCta,
  assetUrl,
} from '../site/chrome'

/* ── Icons (específicos de esta página) ───────────────────────────── */

const ArrowGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Glyph>
)
const CheckGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M4 12l5 5L20 6" /></Glyph>
)
const PauseGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M8 5v14M16 5v14" /></Glyph>
)
const PlayGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M7 4.5v15l12.5-7.5z" /></Glyph>
)

/* ── Utilidades de presentación ───────────────────────────────────── */

/**
 * Renderiza un texto respetando los saltos de línea que el cliente escriba en
 * el panel (los títulos de portada son textareas de una o dos líneas).
 */
function Lines({ text }: { text: string }) {
  const parts = text.split('\n')
  return (
    <>
      {parts.map((line, i) => (
        <span key={i}>
          {line}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */

/** Cada cuánto avanza el carrusel. La barra de progreso usa el mismo valor. */
const SLIDE_MS = 6500

const FOCUS_CLASS: Record<HeroFocus, string> = {
  left: 'object-[30%_center]',
  center: 'object-center',
  right: 'object-[70%_center]',
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Fotos de fondo del hero. Solo rotan las imágenes: el titular y los botones
 * viven fuera, fijos y prerenderizados. La primera foto se pinta sin animación
 * y con prioridad (es el LCP); las demás se montan recién en el cliente.
 */
function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const count = slides.length

  // Autoplay solo en el cliente y nunca con movimiento reducido.
  useEffect(() => {
    setMounted(true)
    setPlaying(!prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (!playing || count < 2) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => window.clearTimeout(t)
  }, [playing, index, count])

  // Si el panel deja menos fotos que el índice actual, volver a la primera.
  const active = index < count ? index : 0

  return (
    <div className="absolute inset-x-0 top-0 h-[var(--hero-media-h)] lg:bottom-3 lg:left-[var(--hero-media-left)] lg:right-0 lg:h-auto">
      <div
        role="group"
        aria-roledescription="carrusel"
        aria-label="Fotos de Vetlain en terreno"
        className="p3-hero-mask absolute inset-0 overflow-hidden bg-neutral-100"
      >
        {slides.map((s, i) => {
          if (i > 0 && !mounted) return null
          const src = assetUrl(s.image)
          if (!src) return null
          const on = i === active
          return (
            <img
              key={`${s.image}-${i}`}
              src={src}
              alt={s.alt}
              aria-hidden={!on}
              fetchPriority={i === 0 ? 'high' : 'low'}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              className={`p3-hero-slide absolute inset-0 h-full w-full object-cover ${FOCUS_CLASS[s.focus] ?? 'object-center'} ${
                on ? 'is-on' : ''
              } ${on && playing ? 'is-moving' : ''}`}
            />
          )
        })}
      </div>

      {count > 1 && (
        <div className="absolute right-3 top-2 z-10 flex items-center gap-2 lg:bottom-8 lg:right-8 lg:top-auto">
          <ol className="flex items-center">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ver foto ${i + 1} de ${count}`}
                  aria-current={i === active ? 'true' : undefined}
                  className="group flex h-11 items-center px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white"
                >
                  <span className="relative block h-1.5 w-8 overflow-hidden bg-white/60 shadow-[0_1px_4px_rgba(0,0,0,0.4)] ring-1 ring-black/30 transition-colors group-hover:bg-white/80 sm:w-10">
                    {i === active && (
                      <span
                        key={`${active}-${playing}`}
                        className={`absolute inset-0 origin-left bg-vetlain-green ${playing ? 'p3-hero-progress' : ''}`}
                        style={{ animationDuration: `${SLIDE_MS}ms` }}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pausar carrusel' : 'Reanudar carrusel'}
            className="flex h-11 w-11 items-center justify-center bg-vetlain-ink/85 text-white transition-colors hover:bg-vetlain-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {playing ? <PauseGlyph className="h-4 w-4" /> : <PlayGlyph className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  )
}

function Hero({ hero }: { hero: HomeContent['hero'] }) {
  const { telUrl } = useSiteContent()
  const slides = hero.slides.filter((s) => s.image)
  const hasMedia = slides.length > 0
  return (
    <section id="top" className={`p3-hero relative overflow-hidden bg-white ${hasMedia ? 'has-media' : ''}`}>
      {hasMedia && <HeroCarousel slides={slides} />}

      <div className="p3-hero-copy relative mx-auto flex max-w-6xl items-center px-5 pb-12 sm:pb-16 lg:mx-0 lg:max-w-none lg:py-20 lg:pl-[var(--hero-pad)] lg:pr-0">
        <div className="p3-rise w-full lg:max-w-[var(--hero-text-w)]">
          {hero.badge && (
            <span className="p3-clip-slash inline-block bg-vetlain-green-tint px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-vetlain-green-deep">
              {hero.badge}
            </span>
          )}
          <h1 className="p3-display mt-5 text-balance text-[clamp(2.8rem,9vw,5.5rem)] uppercase leading-[0.92] text-vetlain-ink lg:text-[clamp(3rem,4.8vw,6rem)]">
            <Lines text={hero.title} />{' '}
            <span className="text-vetlain-green"><Lines text={hero.titleAccent} /></span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
            {hero.text}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <WhatsappBtn className="w-full px-6 py-4 text-base sm:w-auto">{hero.ctaWhatsapp}</WhatsappBtn>
            {hero.ctaCall && (
              <a
                href={telUrl}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-wide text-vetlain-ink underline decoration-vetlain-green decoration-2 underline-offset-[6px] transition-colors hover:text-vetlain-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vetlain-green"
              >
                <PhoneGlyph className="h-4 w-4" />
                {hero.ctaCall}
              </a>
            )}
          </div>
          {hero.note && (
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-vetlain-green-deep">
              <ServiceIcon icon="shield" className="h-4 w-4 text-vetlain-green" />
              {hero.note}
            </p>
          )}
        </div>
      </div>
      <Tape className="relative" />
    </section>
  )
}

/* ── Clientes + certificación ─────────────────────────────────────── */

function Clients({ clients }: { clients: HomeContent['clients'] }) {
  const logos = clients.logos.filter((l) => l.image)
  const iso = assetUrl(clients.isoImage)
  if (!clients.visible || (!logos.length && !iso)) return null
  return (
    <section
      aria-labelledby={clients.title ? 'clientes-titulo' : undefined}
      aria-label={clients.title ? undefined : 'Clientes y certificación'}
      className="border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:py-12 lg:flex-row lg:items-center lg:gap-12">
        {clients.title && (
          <h2
            id="clientes-titulo"
            className="p3-display text-balance text-2xl uppercase leading-tight text-vetlain-ink lg:w-44 lg:shrink-0"
          >
            {clients.title}
          </h2>
        )}
        {logos.length > 0 && (
          <ul className="grid flex-1 grid-cols-3 items-center gap-x-6 gap-y-7 sm:grid-cols-5 sm:gap-x-8">
            {logos.map((l, i) => (
              <li key={`${l.image}-${i}`} className="flex h-14 items-center justify-center">
                <img
                  src={assetUrl(l.image) ?? undefined}
                  alt={l.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </li>
            ))}
          </ul>
        )}
        {iso && (
          <div className="flex items-center gap-4 border-t-2 border-neutral-200 pt-7 lg:border-l-2 lg:border-t-0 lg:pl-10 lg:pt-0">
            <img src={iso} alt="" loading="lazy" className="h-16 w-16 shrink-0 object-contain" />
            {clients.isoText && (
              <p className="max-w-[11rem] text-sm font-bold uppercase leading-snug tracking-wide text-vetlain-ink">
                {clients.isoText}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Trust ────────────────────────────────────────────────────────── */

function Trust({ trust }: { trust: HomeContent['trust'] }) {
  if (!trust.items.length) return null
  return (
    <section className="bg-vetlain-green-tint">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:justify-between">
        {trust.items.map((t) => (
          <span key={t} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-vetlain-ink sm:text-sm">
            <CheckGlyph className="h-4 w-4 text-vetlain-green-dark" />
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}

/* ── Novedades ────────────────────────────────────────────────────── */

/** Enlace de una novedad: interno con el router, externo en pestaña nueva. */
function NewsLink({ href, label }: { href: string; label: string }) {
  const className =
    'mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-bold uppercase tracking-wide text-vetlain-green-dark group-hover:underline'
  const inner = (
    <>
      {label}
      <ArrowGlyph className="h-4 w-4" />
    </>
  )
  return /^https?:\/\//i.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={href} className={className}>
      {inner}
    </Link>
  )
}

function NewsCard({ item }: { item: News }) {
  const img = assetUrl(item.image)
  const href = newsHref(item)
  return (
    <article className="group flex h-full flex-col border-2 border-neutral-200 bg-white transition-colors hover:border-vetlain-green">
      {img && (
        <div className="relative">
          <img
            src={img}
            alt=""
            loading="lazy"
            className="aspect-[16/10] w-full bg-neutral-100 object-cover"
          />
          {item.date && (
            <span className="absolute bottom-0 left-0 bg-vetlain-green-dark px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              {formatDay(item.date)}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {!img && item.date && (
          <span className="mb-3 w-fit bg-vetlain-green-tint px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-vetlain-green-deep">
            {formatDay(item.date)}
          </span>
        )}
        <h3 className="p3-display text-xl uppercase leading-tight text-vetlain-ink">{item.title}</h3>
        {item.excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.excerpt}</p>
        )}
        {href && (
          <NewsLink
            href={href}
            label={item.linkLabel || (item.mode === 'entry' ? 'Leer más' : 'Ver más')}
          />
        )}
      </div>
    </article>
  )
}

function Novedades({
  novedades,
  items,
}: {
  novedades: HomeContent['novedades']
  items: News[] | null
}) {
  // Sin novedades (o con la sección apagada en el panel) no se muestra nada:
  // mejor un hueco que un bloque vacío entre el hero y los servicios.
  if (!novedades.visible || !items?.length) return null
  return (
    <section id="novedades" className="scroll-mt-20 bg-neutral-100">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-vetlain-ink">
          <Lines text={novedades.title} />{' '}
          <span className="text-vetlain-green"><Lines text={novedades.titleAccent} /></span>
        </h2>
        {novedades.intro && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            {novedades.intro}
          </p>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={(i % 3) * 90}>
              <NewsCard item={n} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Services ─────────────────────────────────────────────────────── */

function Services({ services }: { services: HomeContent['services'] }) {
  return (
    <section id="servicios" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-vetlain-ink">
            <Lines text={services.title} />{' '}
            <span className="text-vetlain-green"><Lines text={services.titleAccent} /></span>
          </h2>
          {services.note && (
            <span className="hidden text-sm font-bold uppercase tracking-wide text-neutral-500 sm:block">
              {services.note}
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, i) => (
            <Reveal key={`${item.title}-${i}`} delay={(i % 3) * 90}>
            <div
              className="group relative h-full overflow-hidden border-2 border-neutral-200 bg-white p-6 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-vetlain-green motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* La cinta de marca se despliega desde la izquierda al pasar el cursor. */}
              <span
                aria-hidden="true"
                className="p3-tape absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <div className="p3-clip-tag flex h-12 w-12 items-center justify-center bg-vetlain-green text-white transition-colors duration-200 group-hover:bg-vetlain-green-deep">
                <ServiceIcon icon={item.icon} className="h-6 w-6" />
              </div>
              <h3 className="p3-display mt-5 text-xl uppercase text-vetlain-ink">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Steps ────────────────────────────────────────────────────────── */

function Steps({ steps }: { steps: HomeContent['steps'] }) {
  return (
    <section className="bg-vetlain-green-tint">
      {/* Más ancha que el resto de las secciones (max-w-6xl) para dar aire a los
          tres pasos: el bloque respira y el texto de cada uno deja de apretarse. */}
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-vetlain-ink">
          <Lines text={steps.title} />{' '}
          <span className="text-vetlain-green"><Lines text={steps.titleAccent} /></span>
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-8">
          {steps.items.map((p, i) => (
            <Reveal key={`${p.n}-${i}`} delay={i * 110} className="border-t-2 border-vetlain-green/40 pt-5">
              <span className="p3-clip-tag inline-block bg-vetlain-green-dark px-4 py-2 font-bold text-white">
                <span className="p3-display text-2xl">{p.n}</span>
              </span>
              <h3 className="p3-display mt-4 text-xl uppercase text-vetlain-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Urgency band ─────────────────────────────────────────────────── */

function Urgency({ urgency }: { urgency: HomeContent['urgency'] }) {
  return (
    <section className="bg-vetlain-green-dark">
      <Tape />
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="p3-display text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[0.95] text-white">
            <Lines text={urgency.title} />
          </h2>
          <p className="mt-3 max-w-lg text-white/90">{urgency.text}</p>
        </div>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 bg-vetlain-ink px-7 py-4 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-vetlain-ink"
        >
          <WhatsappGlyph className="h-5 w-5" />
          {urgency.cta}
        </a>
      </div>
      <Tape />
    </section>
  )
}

/* ── Contact ──────────────────────────────────────────────────────── */

const inputClass =
  'w-full border-2 border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-vetlain-ink placeholder:text-neutral-400 transition-colors focus:border-vetlain-green focus:outline-none'

function Contact({ contact }: { contact: HomeContent['contact'] }) {
  const { telUrl, phone, phoneFijo, email, address, hours } = useSiteContent()
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('nombre'),
          phone: data.get('telefono'),
          comuna: data.get('comuna'),
          message: data.get('mensaje'),
          website: data.get('website'), // honeypot
        }),
      })
      if (!res.ok) throw new Error('fallo')
      setSent(true)
      form.reset()
    } catch {
      setError('No pudimos enviar tu mensaje. Escríbenos por WhatsApp y te respondemos al toque.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="contacto" className="scroll-mt-20 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 md:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="p3-display text-[clamp(2rem,5vw,3.25rem)] uppercase leading-none text-vetlain-ink">
            <Lines text={contact.title} />
            <br />
            <span className="text-vetlain-green"><Lines text={contact.titleAccent} /></span>
          </h2>
          <p className="mt-5 max-w-md text-neutral-600">{contact.text}</p>

          <div className="mt-8 flex flex-col gap-3">
            <WhatsappBtn className="px-6 py-4 text-base">Escríbenos por WhatsApp</WhatsappBtn>
            <a
              href={telUrl}
              className="inline-flex items-center justify-center gap-2 border-2 border-vetlain-ink px-6 py-4 text-base font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white"
            >
              <PhoneGlyph className="h-5 w-5" />
              {phone}
            </a>
          </div>

          <ul className="mt-8 space-y-2 text-sm text-neutral-600">
            <li>{address}</li>
            <li>
              {phoneFijo ? `Fijo: ${phoneFijo} · ` : ''}
              {email}
            </li>
            <li>{hours}</li>
          </ul>
        </div>

        <div className="border-2 border-neutral-200 bg-white p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-start justify-center py-6">
              <span className="flex h-12 w-12 items-center justify-center bg-vetlain-green text-white">
                <CheckGlyph className="h-6 w-6" />
              </span>
              <h3 className="p3-display mt-4 text-2xl uppercase text-vetlain-ink">¡Recibido!</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Gracias. Te contactamos a la brevedad. Si es urgente, escríbenos
                directo por WhatsApp.
              </p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-bold uppercase tracking-wide text-vetlain-green-dark hover:underline">
                Enviar otro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="p3-nombre" className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-600">Nombre</span>
                <input id="p3-nombre" name="nombre" type="text" required autoComplete="name" placeholder="Tu nombre" className={inputClass} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label htmlFor="p3-tel" className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-600">Teléfono</span>
                  <input id="p3-tel" name="telefono" type="tel" required autoComplete="tel" placeholder="+56 9 …" className={inputClass} />
                </label>
                <label htmlFor="p3-comuna" className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-600">Comuna</span>
                  <input id="p3-comuna" name="comuna" type="text" placeholder="Talagante…" className={inputClass} />
                </label>
              </div>
              <label htmlFor="p3-msg" className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-600">¿Qué viste?</span>
                <textarea id="p3-msg" name="mensaje" required rows={3} placeholder="Ratones en la cocina, cucarachas en la bodega…" className={`${inputClass} resize-none`} />
              </label>
              {/* Honeypot anti-spam: oculto para humanos, tentador para bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              {error && (
                <p className="border-2 border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 bg-vetlain-green-dark px-6 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-vetlain-green-deep disabled:opacity-60"
              >
                {busy ? 'Enviando…' : 'Quiero que me llamen'}
                <ArrowGlyph className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */

/** Presentación pura: la usan tanto el cliente (tras el fetch) como el prerender. */
export function Prototipo3Body({ news }: { news: News[] | null }) {
  const home = useHomeContent()
  return (
    <div className="p3 min-h-screen bg-white text-vetlain-ink">
      <Seo title={home.seo.title} description={home.seo.description} path="/" />
      <Header />
      <main className="pb-14 md:pb-0">
        <Hero hero={home.hero} />
        <Trust trust={home.trust} />
        <Clients clients={home.clients} />
        <Novedades novedades={home.novedades} items={news} />
        <Services services={home.services} />
        <Steps steps={home.steps} />
        <Urgency urgency={home.urgency} />
        <Contact contact={home.contact} />
      </main>
      <Footer />
      <StickyCta />
    </div>
  )
}

export default function Prototipo3() {
  const { data } = useApi<News[]>('/news')
  return <Prototipo3Body news={data} />
}
