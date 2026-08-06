/** Inicio del panel: saludo + accesos rápidos con conteos + publicar cambios. */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api'
import type { Page, Service, Product, News, BlogPost, SiteContentRow, Lead } from '../lib/types'
import { PageHeading, Card, Button, Notice, Loading } from './ui'

type Counts = {
  contacto: number
  novedades: number
  paginas: number
  servicios: number
  productos: number
  blog: number
  borradores: number
  leadsPendientes: number
}

/**
 * Cada contador se pide por separado y tolera su propio fallo: antes iban todos
 * en un Promise.all y una sola consulta caída (p. ej. una tabla que aún no
 * existe) dejaba el panel entero mostrando ceros, sin decir por qué.
 */
function suave<T>(p: Promise<T[]>): Promise<T[] | null> {
  return p.catch(() => null)
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    Promise.all([
      suave(api.get<SiteContentRow[]>('/admin/content')),
      suave(api.get<Page[]>('/admin/pages')),
      suave(api.get<Service[]>('/admin/services')),
      suave(api.get<Product[]>('/admin/products')),
      suave(api.get<News[]>('/admin/news')),
      suave(api.get<BlogPost[]>('/admin/blog')),
      suave(api.get<Lead[]>('/admin/leads')),
    ]).then((resultados) => {
      const [content, pages, services, products, news, blog, leads] = resultados
      setCounts({
        // Los bloques de la portada viven en site_content pero se editan aparte.
        contacto: content?.filter((r) => r.group !== 'home').length ?? 0,
        novedades: news?.length ?? 0,
        paginas: pages?.length ?? 0,
        servicios: services?.length ?? 0,
        productos: products?.length ?? 0,
        blog: blog?.length ?? 0,
        borradores: blog?.filter((p) => p.status === 'draft').length ?? 0,
        leadsPendientes: leads?.filter((l) => !l.handled).length ?? 0,
      })
      if (resultados.some((r) => r === null)) {
        setAviso(
          'Algunos datos no se pudieron cargar y aparecen en 0. Si el sitio se acaba de actualizar, ' +
            'falta poner la base al día: abre una vez /api/setup?token=TU_SETUP_TOKEN.',
        )
      }
    })
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
    {
      to: '/vzgroups/portada',
      label: 'Portada',
      value: counts?.novedades,
      unit: counts?.novedades === 1 ? 'novedad' : 'novedades',
    },
    { to: '/vzgroups/contacto', label: 'Contacto y redes', value: counts?.contacto, unit: 'datos' },
    { to: '/vzgroups/paginas', label: 'Páginas', value: counts?.paginas, unit: 'páginas' },
    { to: '/vzgroups/servicios', label: 'Servicios', value: counts?.servicios, unit: 'servicios' },
    { to: '/vzgroups/productos', label: 'Productos', value: counts?.productos, unit: 'productos' },
    {
      to: '/vzgroups/blog',
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

      {aviso && (
        <div className="mb-6">
          <Notice kind="error">{aviso}</Notice>
        </div>
      )}

      {counts && counts.leadsPendientes > 0 && (
        <Link to="/vzgroups/mensajes" className="mb-6 block">
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
