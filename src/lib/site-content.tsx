/**
 * Proveedor del contenido suelto del sitio (contacto, redes).
 * Carga /api/content una vez y lo entrega a toda la app. Mientras carga —o si
 * la API falla— usa valores por defecto (los actuales), así el sitio nunca se
 * rompe por falta de datos.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ContentMap = Record<string, unknown>

const DEFAULTS: ContentMap = {
  'contact.phone': '+56 9 6830 2857',
  'contact.whatsapp': '56968302857',
  'contact.email': 'vetlain@vetlain.cl',
  'contact.address': 'Juana Canales 987, Talagante',
  'contact.hours': 'Lun a Vie · 09:00 – 18:00',
  'social.facebook': '',
  'social.instagram': '',
  'social.linkedin': '',
  'social.youtube': '',
}

const ContentCtx = createContext<ContentMap>(DEFAULTS)

export function SiteContentProvider({
  children,
  initial,
}: {
  children: ReactNode
  /** Usado solo por el script de prerender: datos ya cargados, sin fetch. */
  initial?: ContentMap
}) {
  const [map, setMap] = useState<ContentMap>(() => (initial ? { ...DEFAULTS, ...initial } : DEFAULTS))

  useEffect(() => {
    if (initial) return // ya vino precargado (prerender): no repetir la carga.
    let alive = true
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ContentMap | null) => {
        if (!alive || !data) return
        // Combina: los valores de la API pisan los defaults; los vacíos no.
        const merged = { ...DEFAULTS }
        for (const [k, v] of Object.entries(data)) {
          if (v !== null && v !== undefined && v !== '') merged[k] = v
        }
        setMap(merged)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `initial` es fijo (solo lo pasa el prerender, una vez).
  }, [])

  return <ContentCtx.Provider value={map}>{children}</ContentCtx.Provider>
}

/** Acceso al contenido del sitio con helpers de contacto ya derivados. */
export function useSiteContent() {
  const map = useContext(ContentCtx)
  return useMemo(() => {
    const str = (k: string) => (typeof map[k] === 'string' ? (map[k] as string) : '')
    const phone = str('contact.phone')
    const whatsapp = str('contact.whatsapp')
    const socials = (['facebook', 'instagram', 'linkedin', 'youtube'] as const)
      .map((name) => ({ name, href: str(`social.${name}`) }))
      .filter((s) => s.href)
    return {
      phone,
      whatsapp,
      email: str('contact.email'),
      address: str('contact.address'),
      hours: str('contact.hours'),
      whatsappUrl: whatsapp ? `https://wa.me/${whatsapp}` : 'https://wa.me/56968302857',
      telUrl: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : 'tel:+56968302857',
      socials,
    }
  }, [map])
}
