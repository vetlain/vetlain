/** Gestiona el blog: listar, crear, editar, publicar/despublicar y eliminar. */
import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { api, ApiError } from '../lib/api'
import type { BlogPost } from '../lib/types'
import { PageHeading, Card, Field, Input, Textarea, Button, Notice, Loading } from './ui'

type Draft = Partial<BlogPost> & { title: string; slug: string; bodyMd: string }

const blank: Draft = {
  slug: '',
  title: '',
  excerpt: '',
  bodyMd: '',
  coverImage: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
}

/** Sugiere un slug a partir del título (minúsculas, guiones, sin acentos). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes/diacríticos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  function reload() {
    return api.get<BlogPost[]>('/admin/blog').then((data) => {
      // Más recientes primero.
      setPosts([...data].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    })
  }
  useEffect(() => {
    reload()
  }, [])

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d))
  }

  async function save(status?: 'draft' | 'published') {
    if (!draft) return
    const finalStatus = status ?? draft.status ?? 'draft'
    setBusy(true)
    setMsg(null)
    try {
      const payload = {
        slug: draft.slug || slugify(draft.title),
        title: draft.title,
        excerpt: draft.excerpt,
        bodyMd: draft.bodyMd,
        coverImage: draft.coverImage,
        status: finalStatus,
        seoTitle: draft.seoTitle,
        seoDescription: draft.seoDescription,
      }
      if (draft.id) {
        await api.put(`/admin/blog/${draft.id}`, payload)
      } else {
        await api.post('/admin/blog', payload)
      }
      await reload()
      setDraft(null)
      setMsg({ kind: 'success', text: finalStatus === 'published' ? 'Entrada publicada.' : 'Borrador guardado.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: BlogPost) {
    if (!confirm(`¿Eliminar la entrada "${p.title}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.del(`/admin/blog/${p.id}`)
      await reload()
      if (draft?.id === p.id) setDraft(null)
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo eliminar' })
    }
  }

  function edit(p: BlogPost) {
    setDraft({ ...p })
    setShowPreview(false)
    setMsg(null)
  }

  if (!posts) return <Loading />

  return (
    <div>
      <PageHeading title="Blog" description="Publica guías y consejos. Aún sin comentarios." />
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      {/* Lista */}
      {!draft && (
        <>
          <div className="mb-4">
            <Button onClick={() => setDraft({ ...blank })}>+ Nueva entrada</Button>
          </div>
          {posts.length === 0 ? (
            <Card>
              <p className="text-sm text-neutral-500">Aún no hay entradas. Crea la primera.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {posts.map((p) => (
                <Card key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-vetlain-ink">{p.title}</span>
                      <span
                        className={`shrink-0 px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          p.status === 'published'
                            ? 'bg-vetlain-green-tint text-vetlain-green-deep'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {p.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="truncate text-xs text-neutral-500">/blog/{p.slug}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="ghost" onClick={() => edit(p)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => remove(p)}>
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Editor */}
      {draft && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-vetlain-green-dark">
              {draft.id ? 'Editar entrada' : 'Nueva entrada'}
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
              <Input
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value
                  // Autogenera el slug solo si es una entrada nueva y el slug no fue tocado.
                  setDraft((d) =>
                    d ? { ...d, title, slug: !d.id && (!d.slug || d.slug === slugify(d.title)) ? slugify(title) : d.slug } : d,
                  )
                }}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug (URL)">
                <Input value={draft.slug} onChange={(e) => set('slug', e.target.value)} />
              </Field>
              <Field label="Imagen de portada (URL)" hint="Opcional. Pega la URL de una imagen.">
                <Input value={draft.coverImage ?? ''} onChange={(e) => set('coverImage', e.target.value)} />
              </Field>
            </div>
            <Field label="Extracto" hint="Resumen breve que aparece en el listado del blog.">
              <Textarea rows={2} value={draft.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} />
            </Field>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-600">
                  Contenido (Markdown)
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="text-xs font-bold uppercase tracking-wide text-vetlain-green-dark hover:text-vetlain-green-deep"
                >
                  {showPreview ? 'Editar' : 'Vista previa'}
                </button>
              </div>
              {showPreview ? (
                <div
                  className="prose-vetlain min-h-[16rem] border-2 border-neutral-200 bg-white p-4 text-sm"
                  dangerouslySetInnerHTML={{ __html: marked.parse(draft.bodyMd || '_Sin contenido._') as string }}
                />
              ) : (
                <Textarea rows={14} value={draft.bodyMd} onChange={(e) => set('bodyMd', e.target.value)} />
              )}
            </div>

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

            <div className="flex flex-wrap gap-3 border-t-2 border-neutral-200 pt-4">
              <Button onClick={() => save('published')} disabled={busy}>
                {busy ? 'Guardando…' : 'Publicar'}
              </Button>
              <Button variant="ghost" onClick={() => save('draft')} disabled={busy}>
                Guardar como borrador
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
