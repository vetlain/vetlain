/** Inicio del panel: saludo + accesos rápidos con conteos + publicar cambios. */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import type { Page, Service, BlogPost, SiteContentRow, Lead } from '../lib/types'
import { PageHeading, Card, Button, Notice, Loading } from './ui'

type Counts = {
  contacto: number
  paginas: number
  servicios: number
  blog: number
  borradores: number
  leadsPendientes: number
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<SiteContentRow[]>('/admin/content'),
      api.get<Page[]>('/admin/pages'),
      api.get<Service[]>('/admin/services'),
      api.get<BlogPost[]>('/admin/blog'),
      api.get<Lead[]>('/admin/leads'),
    ])
      .then(([content, pages, services, blog, leads]) =>
        setCounts({
          contacto: content.length,
          paginas: pages.length,
          servicios: services.length,
          blog: blog.length,
          borradores: blog.filter((p) => p.status === 'draft').length,
          leadsPendientes: leads.filter((l) => !l.handled).length,
        }),
      )
      .catch(() =>
        setCounts({ contacto: 0, paginas: 0, servicios: 0, blog: 0, borradores: 0, leadsPendientes: 0 }),
      )
  }, [])

  async function publish() {
    setPublishing(true)
    setPublishMsg(null)
    try {
      await api.post('/admin/publish')
      setPublishMsg({
        kind: 'success',
        text: 'Publicación en curso. Los cambios quedarán visibles para Google en 1-2 minutos.',
      })
    } catch (err) {
      setPublishMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo publicar' })
    } finally {
      setPublishing(false)
    }
  }

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
        description="Los cambios se guardan al instante y se ven en el sitio de inmediato. Para que también queden en el HTML que lee Google, publica los cambios."
      />

      {counts && counts.leadsPendientes > 0 && (
        <Link to="/admin/mensajes" className="mb-6 block">
          <div className="flex items-center justify-between border-2 border-vetlain-green bg-vetlain-green-tint px-5 py-4 transition-colors hover:bg-vetlain-green-tint/70">
            <span className="text-sm font-bold uppercase tracking-wide text-vetlain-green-deep">
              Tienes {counts.leadsPendientes} contacto{counts.leadsPendientes === 1 ? '' : 's'} sin atender
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-vetlain-green-dark">Ver →</span>
          </div>
        </Link>
      )}

      <Card className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-vetlain-ink">Publicar cambios</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Actualiza las páginas, servicios y entradas del blog para que Google las vea con el contenido nuevo.
          </p>
        </div>
        <Button onClick={publish} disabled={publishing} className="shrink-0">
          {publishing ? 'Publicando…' : 'Publicar cambios'}
        </Button>
      </Card>
      {publishMsg && (
        <div className="mb-6">
          <Notice kind={publishMsg.kind}>{publishMsg.text}</Notice>
        </div>
      )}

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
