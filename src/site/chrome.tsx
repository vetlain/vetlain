import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { ReactNode, SVGProps } from 'react'
import { mainNav, footerGroups, socialLinks } from './nav'
import type { SocialName } from './nav'

/* ── Constantes ───────────────────────────────────────────────────── */

export const WHATSAPP = 'https://wa.me/56968302857'
export const TEL_MOVIL = 'tel:+56968302857'
// Prefijo de assets públicos (respeta el `base` de Vite: / en dev, /vetlain/ en prod)
export const A = import.meta.env.BASE_URL

/* ── Iconos base y compartidos ────────────────────────────────────── */

export function Glyph(props: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  const { children, ...rest } = props
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const PhoneGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}>
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" />
  </Glyph>
)

export const WhatsappGlyph = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 00-8.53 15.25L2 22l4.9-1.42A10 10 0 1012 2zm0 1.7a8.3 8.3 0 11-4.3 15.4l-.3-.18-2.9.84.86-2.83-.2-.3A8.3 8.3 0 0112 3.7z" />
    <path d="M9.3 7.2c-.2-.45-.36-.35-.55-.36l-.47-.01c-.16 0-.43.06-.66.3-.23.25-.87.85-.87 2.08 0 1.23.9 2.42 1.02 2.58.13.17 1.74 2.77 4.3 3.78 2.13.84 2.57.68 3.03.63.46-.04 1.48-.6 1.69-1.19.2-.58.2-1.08.15-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78z" />
  </svg>
)

export const ChevronGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M9 6l6 6-6 6" /></Glyph>
)

const MenuGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Glyph>
)
const CloseGlyph = (p: SVGProps<SVGSVGElement>) => (
  <Glyph {...p}><path d="M6 6l12 12M18 6L6 18" /></Glyph>
)

/* ── Iconos de marca (redes sociales) ─────────────────────────────── */

const socialGlyphs: Record<SocialName, (p: SVGProps<SVGSVGElement>) => ReactNode> = {
  facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
    </svg>
  ),
  instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2c2.7 0 3 0 4.1.1 1 .1 1.6.2 2 .4.5.2.9.5 1.3.9.4.4.7.8.9 1.3.2.4.3 1 .4 2 .1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 1-.2 1.6-.4 2-.2.5-.5.9-.9 1.3-.4.4-.8.7-1.3.9-.4.2-1 .3-2 .4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1-.1-1.6-.2-2-.4a3.5 3.5 0 01-1.3-.9 3.5 3.5 0 01-.9-1.3c-.2-.4-.3-1-.4-2C3 15 3 14.7 3 12s0-3 .1-4.1c.1-1 .2-1.6.4-2 .2-.5.5-.9.9-1.3.4-.4.8-.7 1.3-.9.4-.2 1-.3 2-.4C9 2 9.3 2 12 2zm0 1.8c-2.7 0-3 0-4 .1-.8 0-1.2.2-1.5.3-.4.1-.6.3-.9.6-.3.3-.5.5-.6.9-.1.3-.3.7-.3 1.5-.1 1-.1 1.3-.1 4s0 3 .1 4c0 .8.2 1.2.3 1.5.1.4.3.6.6.9.3.3.5.5.9.6.3.1.7.3 1.5.3 1 .1 1.3.1 4 .1s3 0 4-.1c.8 0 1.2-.2 1.5-.3.4-.1.6-.3.9-.6.3-.3.5-.5.6-.9.1-.3.3-.7.3-1.5.1-1 .1-1.3.1-4s0-3-.1-4c0-.8-.2-1.2-.3-1.5a2.4 2.4 0 00-.6-.9 2.4 2.4 0 00-.9-.6c-.3-.1-.7-.3-1.5-.3-1-.1-1.3-.1-4-.1zm0 3.1a5.1 5.1 0 110 10.2 5.1 5.1 0 010-10.2zm0 1.8a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6zm5.3-3.1a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M6.9 8.8H3.5V20h3.4V8.8zM5.2 3.5a2 2 0 100 4 2 2 0 000-4zM20.5 20v-6.1c0-3.3-1.8-4.8-4.1-4.8-1.9 0-2.7 1-3.2 1.8V8.8H9.8V20h3.4v-6.2c0-1.6.9-2.4 2-2.4s1.9.8 1.9 2.4V20h3.4z" />
    </svg>
  ),
  youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M22.5 8.2s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C16.9 5 12 5 12 5s-4.9 0-7.7.2c-.4.1-1.2.1-2 .9-.6.6-.8 2.1-.8 2.1S1.3 9.9 1.3 11.6v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 7.4.2 7.4.2s4.9 0 7.7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4v-1.6c0-1.7-.2-3.4-.2-3.4zM9.9 15V9.5l5.1 2.8-5.1 2.7z" />
    </svg>
  ),
}

/* ── Piezas reutilizables ─────────────────────────────────────────── */

export function Tape({ className = '' }: { className?: string }) {
  return <div className={`p3-tape h-3 w-full ${className}`} aria-hidden="true" />
}

export function WhatsappBtn({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-vetlain-green-dark px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-vetlain-green-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vetlain-green ${className}`}
    >
      <WhatsappGlyph className="h-5 w-5" />
      {children}
    </a>
  )
}

/* ── Header con navegación ────────────────────────────────────────── */

const navLinkBase =
  'text-sm font-bold uppercase tracking-wide transition-colors'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b-2 border-vetlain-green bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Vetlain, inicio">
          <img src={A + 'brand/logo-recortado.png'} alt="Vetlain" className="h-9 w-auto" width={327} height={107} />
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden md:flex md:items-center md:gap-7">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? 'text-vetlain-green-dark'
                    : 'text-vetlain-ink hover:text-vetlain-green-dark'
                } border-b-2 pb-0.5 ${isActive ? 'border-vetlain-green' : 'border-transparent'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={TEL_MOVIL}
            className="hidden items-center gap-2 border-2 border-vetlain-ink px-4 py-2 text-sm font-bold uppercase tracking-wide text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white lg:inline-flex"
          >
            <PhoneGlyph className="h-4 w-4" />
            Llamar
          </a>
          <WhatsappBtn className="px-4 py-2">WhatsApp</WhatsappBtn>

          {/* Botón de menú (mobile) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-vetlain-ink text-vetlain-ink transition-colors hover:bg-vetlain-ink hover:text-white md:hidden"
          >
            {open ? <CloseGlyph className="h-5 w-5" /> : <MenuGlyph className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Panel de menú (mobile) */}
      {open && (
        <nav
          id="menu-movil"
          aria-label="Principal (móvil)"
          className="border-t-2 border-vetlain-green/40 bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {[...mainNav, { label: 'Contacto', to: '/contacto' }].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-neutral-200 py-3.5 ${navLinkBase} ${
                    isActive ? 'text-vetlain-green-dark' : 'text-vetlain-ink'
                  }`
                }
              >
                {item.label}
                <ChevronGlyph className="h-4 w-4 text-vetlain-green" />
              </NavLink>
            ))}
            <a
              href={TEL_MOVIL}
              className="mt-3 inline-flex items-center justify-center gap-2 border-2 border-vetlain-ink px-4 py-3 text-sm font-bold uppercase tracking-wide text-vetlain-ink"
            >
              <PhoneGlyph className="h-4 w-4" />
              Llamar ahora
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

/* ── Footer ───────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="bg-vetlain-ink text-neutral-400">
      <Tape />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr]">
        {/* Marca + contacto */}
        <div>
          <img
            src={A + 'brand/logo-recortado.png'}
            alt="Vetlain"
            className="h-9 w-auto brightness-0 invert"
            width={327}
            height={107}
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Control y mantención ambiental. Desratización, desinsectación y
            sanitización en Talagante y alrededores.
          </p>
          <ul className="mt-5 space-y-1.5 text-sm">
            <li>Juana Canales 987, Talagante</li>
            <li>
              <a href={TEL_MOVIL} className="transition-colors hover:text-white">
                +56 9 6830 2857
              </a>
              {' · '}
              <a href="mailto:vetlain@vetlain.cl" className="transition-colors hover:text-white">
                vetlain@vetlain.cl
              </a>
            </li>
            <li>Lun a Vie · 09:00 – 18:00</li>
          </ul>
        </div>

        {/* Columnas de enlaces */}
        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="p3-display flex items-center gap-2 text-sm uppercase tracking-wide text-white">
              <span className="h-3 w-1.5 bg-vetlain-green" aria-hidden="true" />
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Barra inferior: copyright + redes */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-4 px-5 py-5 sm:flex-row">
          <span className="text-xs uppercase tracking-wide">
            © {new Date().getFullYear()} Vetlain · Todos los derechos reservados
          </span>
          <ul className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center border border-neutral-700 text-neutral-400 transition-colors hover:border-vetlain-green hover:bg-vetlain-green-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vetlain-green"
                >
                  {socialGlyphs[s.name]({ className: 'h-5 w-5' })}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

/* ── CTA sticky (mobile) ──────────────────────────────────────────── */

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t-2 border-vetlain-green md:hidden">
      <a href={TEL_MOVIL} className="flex items-center justify-center gap-2 bg-vetlain-ink py-3.5 text-sm font-bold uppercase tracking-wide text-white">
        <PhoneGlyph className="h-5 w-5" />
        Llamar
      </a>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-vetlain-green-dark py-3.5 text-sm font-bold uppercase tracking-wide text-white">
        <WhatsappGlyph className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  )
}
