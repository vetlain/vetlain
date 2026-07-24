/** Edita, crea y elimina fichas de producto del catálogo. */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { Product, ProductCategory } from '../lib/types'
import { PRODUCT_CATEGORIES } from '../lib/types'
import { PageHeading, Card, Field, Input, Textarea, Button, Notice, Loading } from './ui'

type Draft = Partial<Product> & { name: string; slug: string; category: ProductCategory }

const blank: Draft = {
  slug: '',
  name: '',
  category: 'roedores',
  summary: '',
  bodyMd: '',
  image: '',
  published: true,
}

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  function reload() {
    return api.get<Product[]>('/admin/products').then(setProducts)
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
        name: draft.name,
        category: draft.category,
        summary: draft.summary,
        bodyMd: draft.bodyMd,
        image: draft.image,
        published: draft.published,
      }
      if (draft.id) {
        await api.put(`/admin/products/${draft.id}`, payload)
      } else {
        await api.post('/admin/products', payload)
      }
      await reload()
      setDraft(null)
      setMsg({ kind: 'success', text: 'Producto guardado.' })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: Product) {
    if (!confirm(`¿Eliminar el producto "${p.name}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.del(`/admin/products/${p.id}`)
      await reload()
      if (draft?.id === p.id) setDraft(null)
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo eliminar' })
    }
  }

  if (!products) return <Loading />

  return (
    <div>
      <PageHeading
        title="Productos"
        description="El catálogo que aparece en la sección Productos del sitio, agrupado por categoría."
      />
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      {!draft && (
        <>
          <div className="mb-4">
            <Button onClick={() => setDraft({ ...blank })}>+ Nuevo producto</Button>
          </div>
          <div className="space-y-2">
            {products.map((p) => (
              <Card key={p.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold uppercase tracking-wide text-vetlain-ink">
                      {p.name}
                    </span>
                    <span className="shrink-0 bg-vetlain-green-tint px-1.5 py-0.5 text-[10px] font-bold uppercase text-vetlain-green-deep">
                      {p.category}
                    </span>
                    {!p.published && (
                      <span className="shrink-0 bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-neutral-600">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-neutral-500">/productos/{p.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" onClick={() => setDraft({ ...p })}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => remove(p)}>
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
              {draft.id ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button
              onClick={() => setDraft(null)}
              className="text-xs font-bold uppercase text-neutral-500 hover:text-vetlain-ink"
            >
              ← Volver
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre">
                <Input value={draft.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Slug (URL)" hint="Solo minúsculas y guiones. Ej: nara-lure">
                <Input value={draft.slug} onChange={(e) => set('slug', e.target.value)} />
              </Field>
              <Field label="Categoría">
                <select
                  value={draft.category}
                  onChange={(e) => set('category', e.target.value as ProductCategory)}
                  className="w-full border-2 border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-vetlain-green"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.heading}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Imagen" hint="Ruta dentro del sitio (ej: brand/productos/ekomille.png) o URL completa.">
                <Input value={draft.image ?? ''} onChange={(e) => set('image', e.target.value)} />
              </Field>
            </div>
            <Field label="Resumen" hint="Frase corta que se muestra en la tarjeta del catálogo.">
              <Textarea rows={2} value={draft.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
            </Field>
            <Field label="Contenido (Markdown)" hint="Descripción larga y lista de características.">
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
              {busy ? 'Guardando…' : 'Guardar producto'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
