/** Inicio del panel: saludo + accesos rápidos con conteos. */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Page, Service, BlogPost, SiteContentRow } from '../lib/types'
import { PageHeading, Card, Loading } from './ui'

type Counts = { contacto: number; paginas: number; servicios: number; blog: number; borradores: number }

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<SiteContentRow[]>('/admin/content'),
      api.get<Page[]>('/admin/pages'),
      api.get<Service[]>('/admin/services'),
      api.get<BlogPost[]>('/admin/blog'),
    ])
      .then(([content, pages, services, blog]) =>
        setCounts({
          contacto: content.length,
          paginas: pages.length,
          servicios: services.length,
          blog: blog.length,
          borradores: blog.filter((p) => p.status === 'draft').length,
        }),
      )
      .catch(() => setCounts({ contacto: 0, paginas: 0, servicios: 0, blog: 0, borradores: 0 }))
  }, [])

  const tiles = [
    { to: '/admin/contacto', label: 'Contacto y redes', value: counts?.contacto, unit: 'datos' },
    { to: '/admin/paginas', label: 'Páginas', value: counts?.paginas, unit: 'páginas' },
    { to: '/admin/servicios', label: 'Servicios', value: counts?.servicios, unit: 'servicios' },
    {
      to: '/admin/blog',
      label: 'Blog',
      value: counts?.blog,
      unit: counts?.borradores ? `entradas · ${counts.borradores} borrador(es)` : 'entradas',
    },
  ]

  return (
    <div>
      <PageHeading
        title="Bienvenido al panel"
        description="Desde aquí editas los contenidos del sitio y el blog. Los cambios se ven publicados en el sitio."
      />
      {!counts ? (
        <Loading />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link key={t.to} to={t.to}>
              <Card className="transition-colors hover:border-vetlain-green">
                <div className="text-3xl font-extrabold text-vetlain-green-dark">{t.value ?? '—'}</div>
                <div className="mt-1 text-sm font-bold uppercase tracking-wide text-vetlain-ink">
                  {t.label}
                </div>
                <div className="text-xs text-neutral-500">{t.unit}</div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
