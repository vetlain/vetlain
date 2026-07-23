/** Edita las páginas largas (nosotros, cobertura, FAQ, servicios, contacto). */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { Page } from '../lib/types'
import { PageHeading, Card, Field, Input, Textarea, Button, Notice, Loading } from './ui'

export default function PagesEditor() {
  const [pages, setPages] = useState<Page[] | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Page | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api.get<Page[]>('/admin/pages').then((data) => {
      setPages(data)
      if (data.length) select(data[0])
    })
  }, [])

  function select(p: Page) {
    setSelectedId(p.id)
    setDraft({ ...p })
    setMsg(null)
  }

  function set<K extends keyof Page>(key: K, value: Page[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d))
  }

  async function save() {
    if (!draft) return
    setBusy(true)
    setMsg(null)
    try {
      const updated = await api.put<Page>(`/admin/pages/${draft.id}`, {
        title: draft.title,
        kicker: draft.kicker,
        description: draft.description,
        bodyMd: draft.bodyMd,
        seoTitle: draft.seoTitle,
        seoDescription: draft.seoDescription,
      })
      setPages((list) => list?.map((p) => (p.id === updated.id ? updated : p)) ?? null)
      setMsg({ kind: 'success', text: 'Página guardada.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  if (!pages) return <Loading />

  return (
    <div>
      <PageHeading title="Páginas" description="Edita el contenido y el SEO de cada página del sitio." />

      <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
        {/* Lista de páginas */}
        <ul className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => select(p)}
                className={`w-full whitespace-nowrap px-3 py-2 text-left text-sm font-bold uppercase tracking-wide transition-colors ${
                  selectedId === p.id
                    ? 'bg-white text-vetlain-green-dark shadow-sm'
                    : 'text-neutral-500 hover:text-vetlain-ink'
                }`}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>

        {/* Editor */}
        {draft && (
          <Card>
            {msg && (
              <div className="mb-4">
                <Notice kind={msg.kind}>{msg.text}</Notice>
              </div>
            )}
            <p className="mb-4 text-xs text-neutral-500">
              URL: <code className="bg-neutral-100 px-1">/{draft.slug}</code>
            </p>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Título">
                  <Input value={draft.title} onChange={(e) => set('title', e.target.value)} />
                </Field>
                <Field label="Antetítulo (kicker)">
                  <Input value={draft.kicker ?? ''} onChange={(e) => set('kicker', e.target.value)} />
                </Field>
              </div>
              <Field label="Descripción / intro">
                <Textarea
                  rows={2}
                  value={draft.description ?? ''}
                  onChange={(e) => set('description', e.target.value)}
                />
              </Field>
              <Field label="Contenido (Markdown)" hint="Usa ## para subtítulos, - para listas, **negrita**.">
                <Textarea
                  rows={12}
                  value={draft.bodyMd ?? ''}
                  onChange={(e) => set('bodyMd', e.target.value)}
                />
              </Field>

              <div className="border-t-2 border-dashed border-neutral-200 pt-4">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-neutral-500">
                  SEO (cómo se ve en Google)
                </p>
                <div className="space-y-4">
                  <Field label="Título SEO" hint="Ideal ≤ 60 caracteres.">
                    <Input value={draft.seoTitle ?? ''} onChange={(e) => set('seoTitle', e.target.value)} />
                  </Field>
                  <Field label="Descripción SEO" hint="Ideal ≤ 155 caracteres.">
                    <Textarea
                      rows={2}
                      value={draft.seoDescription ?? ''}
                      onChange={(e) => set('seoDescription', e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              <Button onClick={save} disabled={busy}>
                {busy ? 'Guardando…' : 'Guardar página'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
