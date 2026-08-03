/**
 * Novedades de la portada: crear, editar, ordenar y eliminar las tarjetas que
 * aparecen entre el hero y "Qué eliminamos". Vive dentro de la sección Portada
 * del panel (src/admin/HomeEditor.tsx).
 */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { News } from '../lib/types'
import { formatDay } from '../lib/format'
import { assetUrl } from '../site/chrome'
import { Card, Field, Input, Textarea, Button, Notice, Loading } from './ui'
import { ImageField } from './ImageField'

type Draft = Partial<News> & { title: string }

const blank: Draft = {
  title: '',
  excerpt: '',
  image: '',
  link: '',
  linkLabel: '',
  date: new Date().toISOString().slice(0, 10),
  sortOrder: 0,
  published: true,
}

export default function NewsEditor() {
  const [items, setItems] = useState<News[] | null>(null)
  const [cargaFallida, setCargaFallida] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  // Ojo: si la carga falla hay que decirlo. Sin este catch, `items` se quedaba
  // en null y la pestaña mostraba el spinner para siempre.
  function reload() {
    return api
      .get<News[]>('/admin/news')
      .then((rows) => {
        setItems(rows)
        setCargaFallida(null)
      })
      .catch((err) => {
        setCargaFallida(
          err instanceof ApiError && err.status >= 500
            ? 'No se pudieron cargar las novedades. Si el sitio se acaba de actualizar, falta crear la tabla en la base: abre una vez /api/setup?token=TU_SETUP_TOKEN y vuelve a esta pestaña.'
            : err instanceof ApiError
              ? err.message
              : 'No se pudieron cargar las novedades.',
        )
      })
  }
  useEffect(() => {
    reload()
  }, [])

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d))
  }

  async function save() {
    if (!draft) return
    if (!draft.title.trim()) {
      setMsg({ kind: 'error', text: 'La novedad necesita un título.' })
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const payload = {
        title: draft.title,
        excerpt: draft.excerpt ?? '',
        image: draft.image ?? '',
        link: draft.link ?? '',
        linkLabel: draft.linkLabel ?? '',
        date: draft.date ?? '',
        sortOrder: Number(draft.sortOrder) || 0,
        published: draft.published ?? true,
      }
      if (draft.id) {
        await api.put(`/admin/news/${draft.id}`, payload)
      } else {
        await api.post('/admin/news', payload)
      }
      await reload()
      setDraft(null)
      setMsg({ kind: 'success', text: 'Novedad guardada.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  async function remove(n: News) {
    if (!confirm(`¿Eliminar la novedad "${n.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.del(`/admin/news/${n.id}`)
      await reload()
      if (draft?.id === n.id) setDraft(null)
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo eliminar' })
    }
  }

  /**
   * Sube o baja una novedad. Renumera toda la lista (0, 1, 2…) en vez de
   * intercambiar dos valores: así se corrige sola si quedaron órdenes repetidos.
   */
  async function move(index: number, dir: -1 | 1) {
    if (!items) return
    const other = index + dir
    if (other < 0 || other >= items.length) return
    const next = [...items]
    ;[next[index], next[other]] = [next[other], next[index]]
    setBusy(true)
    try {
      const cambios = next
        .map((n, i) => ({ n, i }))
        .filter(({ n, i }) => n.sortOrder !== i)
      await Promise.all(cambios.map(({ n, i }) => api.put(`/admin/news/${n.id}`, { sortOrder: i })))
      await reload()
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo reordenar' })
    } finally {
      setBusy(false)
    }
  }

  if (!items) return cargaFallida ? <Notice kind="error">{cargaFallida}</Notice> : <Loading />

  return (
    <div>
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      {!draft && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Button onClick={() => setDraft({ ...blank, sortOrder: items.length })}>
              + Nueva novedad
            </Button>
            <span className="text-xs text-neutral-500">
              Se muestran en la portada en este mismo orden.
            </span>
          </div>

          {items.length === 0 ? (
            <Card className="text-sm text-neutral-600">
              Todavía no hay novedades. Mientras no exista ninguna publicada, la sección no
              aparece en la portada.
            </Card>
          ) : (
            <div className="space-y-2">
              {items.map((n, i) => (
                <Card key={n.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {n.image ? (
                      <img
                        src={assetUrl(n.image) ?? ''}
                        alt=""
                        className="h-12 w-16 shrink-0 border-2 border-neutral-200 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 shrink-0 border-2 border-neutral-200 bg-neutral-100" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold uppercase tracking-wide text-vetlain-ink">
                          {n.title}
                        </span>
                        {!n.published && (
                          <span className="shrink-0 bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-neutral-600">
                            Oculta
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-neutral-500">
                        {n.date ? formatDay(n.date) : 'Sin fecha'}
                        {n.link ? ` · ${n.link}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        aria-label="Subir"
                        disabled={busy || i === 0}
                        onClick={() => move(i, -1)}
                        className="px-2 text-xs font-bold text-neutral-500 hover:text-vetlain-green-dark disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        aria-label="Bajar"
                        disabled={busy || i === items.length - 1}
                        onClick={() => move(i, 1)}
                        className="px-2 text-xs font-bold text-neutral-500 hover:text-vetlain-green-dark disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    <Button variant="ghost" onClick={() => setDraft({ ...n })}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => remove(n)}>
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {draft && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-vetlain-green-dark">
              {draft.id ? 'Editar novedad' : 'Nueva novedad'}
            </h2>
            <button
              onClick={() => setDraft(null)}
              className="text-xs font-bold uppercase text-neutral-500 hover:text-vetlain-ink"
            >
              ← Volver
            </button>
          </div>
          <div className="space-y-4">
            <Field label="Título">
              <Input value={draft.title} onChange={(e) => set('title', e.target.value)} />
            </Field>
            <Field label="Texto" hint="Dos o tres líneas. Es lo que se lee en la tarjeta.">
              <Textarea rows={3} value={draft.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} />
            </Field>
            <ImageField
              label="Imagen"
              hint="Opcional. Si no pones una, la tarjeta se muestra solo con texto."
              value={draft.image ?? ''}
              onChange={(v) => set('image', v)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Enlace" hint="Opcional. Una ruta del sitio (/servicios) o una URL completa.">
                <Input
                  value={draft.link ?? ''}
                  onChange={(e) => set('link', e.target.value)}
                  placeholder="/servicios/desratizacion"
                />
              </Field>
              <Field label="Texto del enlace" hint="Si lo dejas vacío se muestra «Ver más».">
                <Input value={draft.linkLabel ?? ''} onChange={(e) => set('linkLabel', e.target.value)} />
              </Field>
              <Field label="Fecha" hint="Opcional. Se muestra sobre la tarjeta.">
                <Input type="date" value={draft.date ?? ''} onChange={(e) => set('date', e.target.value)} />
              </Field>
              <Field label="Orden" hint="Menor número, más arriba.">
                <Input
                  type="number"
                  value={String(draft.sortOrder ?? 0)}
                  onChange={(e) => set('sortOrder', Number(e.target.value))}
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-vetlain-ink">
              <input
                type="checkbox"
                checked={draft.published ?? true}
                onChange={(e) => set('published', e.target.checked)}
                className="h-4 w-4 accent-vetlain-green-dark"
              />
              Publicada (visible en la portada)
            </label>
            <Button onClick={save} disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar novedad'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
