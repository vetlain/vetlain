/** Edita, crea y elimina fichas de servicio. */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { Service } from '../lib/types'
import { PageHeading, Card, Field, Input, Textarea, Button, Notice, Loading } from './ui'

type Draft = Partial<Service> & { title: string; slug: string }

const ICONS = ['rodent', 'insect', 'bird', 'spray', 'building', 'shield']

const blank: Draft = {
  slug: '',
  title: '',
  kicker: 'Servicio',
  summary: '',
  bodyMd: '',
  icon: 'shield',
  published: true,
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[] | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  function reload() {
    return api.get<Service[]>('/admin/services').then(setServices)
  }
  useEffect(() => {
    reload()
  }, [])

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d))
  }

  async function save() {
    if (!draft) return
    setBusy(true)
    setMsg(null)
    try {
      const payload = {
        slug: draft.slug,
        title: draft.title,
        kicker: draft.kicker,
        summary: draft.summary,
        bodyMd: draft.bodyMd,
        icon: draft.icon,
        published: draft.published,
      }
      if (draft.id) {
        await api.put(`/admin/services/${draft.id}`, payload)
      } else {
        await api.post('/admin/services', payload)
      }
      await reload()
      setDraft(null)
      setMsg({ kind: 'success', text: 'Servicio guardado.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  async function remove(s: Service) {
    if (!confirm(`¿Eliminar el servicio "${s.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.del(`/admin/services/${s.id}`)
      await reload()
      if (draft?.id === s.id) setDraft(null)
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo eliminar' })
    }
  }

  if (!services) return <Loading />

  return (
    <div>
      <PageHeading title="Servicios" description="Las fichas que aparecen en la sección de servicios del sitio." />
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      {!draft && (
        <>
          <div className="mb-4">
            <Button onClick={() => setDraft({ ...blank })}>+ Nuevo servicio</Button>
          </div>
          <div className="space-y-2">
            {services.map((s) => (
              <Card key={s.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold uppercase tracking-wide text-vetlain-ink">
                      {s.title}
                    </span>
                    {!s.published && (
                      <span className="shrink-0 bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-neutral-600">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-neutral-500">/servicios/{s.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => setDraft({ ...s })}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => remove(s)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {draft && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-vetlain-green-dark">
              {draft.id ? 'Editar servicio' : 'Nuevo servicio'}
            </h2>
            <button onClick={() => setDraft(null)} className="text-xs font-bold uppercase text-neutral-500 hover:text-vetlain-ink">
              ← Volver
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título">
                <Input value={draft.title} onChange={(e) => set('title', e.target.value)} />
              </Field>
              <Field label="Slug (URL)" hint="Solo minúsculas y guiones. Ej: control-de-aves">
                <Input value={draft.slug} onChange={(e) => set('slug', e.target.value)} />
              </Field>
              <Field label="Antetítulo">
                <Input value={draft.kicker ?? ''} onChange={(e) => set('kicker', e.target.value)} />
              </Field>
              <Field label="Icono">
                <select
                  value={draft.icon ?? 'shield'}
                  onChange={(e) => set('icon', e.target.value)}
                  className="w-full border-2 border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-vetlain-green"
                >
                  {ICONS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Resumen" hint="Frase corta que se muestra en la tarjeta del servicio.">
              <Textarea rows={2} value={draft.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
            </Field>
            <Field label="Contenido (Markdown)">
              <Textarea rows={10} value={draft.bodyMd ?? ''} onChange={(e) => set('bodyMd', e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium text-vetlain-ink">
              <input
                type="checkbox"
                checked={draft.published ?? true}
                onChange={(e) => set('published', e.target.checked)}
                className="h-4 w-4 accent-vetlain-green-dark"
              />
              Publicado (visible en el sitio)
            </label>
            <Button onClick={save} disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar servicio'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
