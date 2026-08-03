/**
 * Sección "Portada" del panel: edita todo el contenido de la home (/).
 *
 *  - Pestaña "Contenido": los bloques de site_content (grupo "home"), uno por
 *    tarjeta. Se guardan solo los bloques que cambiaron.
 *  - Pestaña "Novedades": la tabla `news` (src/admin/NewsEditor.tsx).
 *
 * La estructura de cada bloque y sus valores por defecto viven en
 * src/lib/home-content.ts, junto al sitio que los consume.
 */
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, ApiError } from '../lib/api'
import type { SiteContentRow } from '../lib/types'
import { buildHomeContent, homeKey, HOME_BLOCKS } from '../lib/home-content'
import type { HomeContent, HomeBlock, HomeCard, HomeStep } from '../lib/home-content'
import { SERVICE_ICONS } from '../site/service-icons'
import { PageHeading, Card, Field, Input, Textarea, Select, Button, Notice, Loading } from './ui'
import { ImageField } from './ImageField'
import NewsEditor from './NewsEditor'

/** Etiquetas con las que se crean las claves nuevas en site_content. */
const BLOCK_LABELS: Record<HomeBlock, string> = {
  seo: 'Portada · Título y descripción en Google',
  hero: 'Portada · Encabezado principal',
  trust: 'Portada · Cinta de garantías',
  novedades: 'Portada · Novedades (encabezado)',
  services: 'Portada · Qué eliminamos',
  steps: 'Portada · Cómo trabajamos',
  urgency: 'Portada · Franja de urgencia',
  contact: 'Portada · Contacto',
}

/* ── Piezas reutilizables ────────────────────────────────────────────── */

/** Tarjeta de un bloque, con título y explicación de dónde se ve. */
function Block({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="text-sm font-extrabold uppercase tracking-wide text-vetlain-green-dark">
        {title}
      </h2>
      <p className="mb-4 mt-1 text-xs text-neutral-500">{hint}</p>
      <div className="space-y-4">{children}</div>
    </Card>
  )
}

/** Cabecera de una fila de lista: número + botones de orden y borrado. */
function RowTools({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number
  total: number
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        {index + 1} de {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Subir"
          disabled={index === 0}
          onClick={() => onMove(-1)}
          className="px-2 py-1 text-xs font-bold text-neutral-500 hover:text-vetlain-green-dark disabled:opacity-30"
        >
          ▲
        </button>
        <button
          type="button"
          aria-label="Bajar"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          className="px-2 py-1 text-xs font-bold text-neutral-500 hover:text-vetlain-green-dark disabled:opacity-30"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="px-2 py-1 text-xs font-bold uppercase text-neutral-500 hover:text-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

/** Lista editable genérica (tarjetas de servicios, pasos…). */
function ListEditor<T>({
  items,
  onChange,
  blank,
  addLabel,
  render,
}: {
  items: T[]
  onChange: (items: T[]) => void
  blank: () => T
  addLabel: string
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border-2 border-neutral-200 bg-neutral-50 p-4">
          <RowTools
            index={i}
            total={items.length}
            onMove={(dir) => move(i, dir)}
            onRemove={() => onChange(items.filter((_, k) => k !== i))}
          />
          {render(item, (patch) =>
            onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it))),
          )}
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onChange([...items, blank()])}>
        + {addLabel}
      </Button>
    </div>
  )
}

/** Lista de frases sueltas (la cinta de garantías). */
function TextListEditor({
  items,
  onChange,
  addLabel,
}: {
  items: string[]
  onChange: (items: string[]) => void
  addLabel: string
}) {
  return (
    <div className="space-y-2">
      {items.map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={t} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} />
          <button
            type="button"
            aria-label="Eliminar"
            onClick={() => onChange(items.filter((_, k) => k !== i))}
            className="shrink-0 px-2 py-1 text-xs font-bold uppercase text-neutral-500 hover:text-red-700"
          >
            Eliminar
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onChange([...items, ''])}>
        + {addLabel}
      </Button>
    </div>
  )
}

/** Par de campos "título + parte en verde", que se repite en varias secciones. */
function Heading({
  title,
  accent,
  onTitle,
  onAccent,
}: {
  title: string
  accent: string
  onTitle: (v: string) => void
  onAccent: (v: string) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Título">
        <Input value={title} onChange={(e) => onTitle(e.target.value)} />
      </Field>
      <Field label="Continuación (en verde)">
        <Input value={accent} onChange={(e) => onAccent(e.target.value)} />
      </Field>
    </div>
  )
}

/* ── Pestaña de contenido ────────────────────────────────────────────── */

function ContentTab() {
  const [original, setOriginal] = useState<HomeContent | null>(null)
  const [draft, setDraft] = useState<HomeContent | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    api
      .get<SiteContentRow[]>('/admin/content')
      .then((rows) => {
        const map: Record<string, unknown> = {}
        for (const r of rows) map[r.key] = r.value
        const home = buildHomeContent(map)
        setOriginal(home)
        setDraft(home)
      })
      .catch(() => setMsg({ kind: 'error', text: 'No se pudo cargar el contenido de la portada.' }))
  }, [])

  /** Actualiza un bloque del borrador sin tocar los demás. */
  function set<K extends HomeBlock>(block: K, patch: Partial<HomeContent[K]>) {
    setDraft((d) => (d ? { ...d, [block]: { ...d[block], ...patch } } : d))
  }

  const changed = useMemo(() => {
    if (!original || !draft) return []
    return HOME_BLOCKS.filter((b) => JSON.stringify(original[b]) !== JSON.stringify(draft[b]))
  }, [original, draft])

  async function save() {
    if (!draft || !changed.length) return
    setBusy(true)
    setMsg(null)
    try {
      for (const block of changed) {
        await api.put(`/admin/content/${homeKey(block)}`, {
          value: draft[block],
          label: BLOCK_LABELS[block],
          group: 'home',
        })
      }
      setOriginal(draft)
      setMsg({
        kind: 'success',
        text: `Guardado (${changed.length} bloque${changed.length === 1 ? '' : 's'}). Ya se ve en el sitio; para que Google lo lea, pulsa «Publicar cambios» en el inicio del panel.`,
      })
    } catch (err) {
      setMsg({ kind: 'error', text: err instanceof ApiError ? err.message : 'No se pudo guardar' })
    } finally {
      setBusy(false)
    }
  }

  if (!draft) return msg ? <Notice kind="error">{msg.text}</Notice> : <Loading />

  return (
    <div>
      {msg && (
        <div className="mb-4">
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      )}

      <div className="space-y-5">
        <Block
          title="Encabezado principal (hero)"
          hint="Lo primero que se ve al entrar: titular, texto, botones y foto."
        >
          <Field label="Etiqueta superior" hint="La pastilla verde sobre el titular.">
            <Input value={draft.hero.badge} onChange={(e) => set('hero', { badge: e.target.value })} />
          </Field>
          <Heading
            title={draft.hero.title}
            accent={draft.hero.titleAccent}
            onTitle={(v) => set('hero', { title: v })}
            onAccent={(v) => set('hero', { titleAccent: v })}
          />
          <Field label="Texto">
            <Textarea rows={3} value={draft.hero.text} onChange={(e) => set('hero', { text: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Botón de WhatsApp">
              <Input value={draft.hero.ctaWhatsapp} onChange={(e) => set('hero', { ctaWhatsapp: e.target.value })} />
            </Field>
            <Field label="Botón de llamada">
              <Input value={draft.hero.ctaCall} onChange={(e) => set('hero', { ctaCall: e.target.value })} />
            </Field>
          </div>
          <Field label="Nota bajo los botones">
            <Input value={draft.hero.note} onChange={(e) => set('hero', { note: e.target.value })} />
          </Field>
          <ImageField
            label="Foto del hero"
            hint="Se recorta a un formato apaisado (4:3). Ideal: 1200 × 900 px o más."
            value={draft.hero.image}
            onChange={(v) => set('hero', { image: v })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Descripción de la foto"
              hint="Para buscadores y lectores de pantalla. Describe lo que se ve."
            >
              <Input value={draft.hero.imageAlt} onChange={(e) => set('hero', { imageAlt: e.target.value })} />
            </Field>
            <Field label="Etiqueta sobre la foto">
              <Input value={draft.hero.imageBadge} onChange={(e) => set('hero', { imageBadge: e.target.value })} />
            </Field>
          </div>
        </Block>

        <Block title="Cinta de garantías" hint="La franja verde clara justo debajo del hero.">
          <TextListEditor
            items={draft.trust.items}
            onChange={(items) => set('trust', { items })}
            addLabel="Añadir garantía"
          />
        </Block>

        <Block
          title="Novedades (encabezado)"
          hint="Título y bajada de la sección de novedades. Las tarjetas se administran en la pestaña «Novedades»."
        >
          <label className="flex items-center gap-2 text-sm font-medium text-vetlain-ink">
            <input
              type="checkbox"
              checked={draft.novedades.visible}
              onChange={(e) => set('novedades', { visible: e.target.checked })}
              className="h-4 w-4 accent-vetlain-green-dark"
            />
            Mostrar la sección de novedades en la portada
          </label>
          <Heading
            title={draft.novedades.title}
            accent={draft.novedades.titleAccent}
            onTitle={(v) => set('novedades', { title: v })}
            onAccent={(v) => set('novedades', { titleAccent: v })}
          />
          <Field label="Bajada">
            <Textarea
              rows={2}
              value={draft.novedades.intro}
              onChange={(e) => set('novedades', { intro: e.target.value })}
            />
          </Field>
        </Block>

        <Block title="Qué eliminamos" hint="Las tarjetas con icono que resumen los servicios.">
          <Heading
            title={draft.services.title}
            accent={draft.services.titleAccent}
            onTitle={(v) => set('services', { title: v })}
            onAccent={(v) => set('services', { titleAccent: v })}
          />
          <Field label="Texto a la derecha del título" hint="Por ejemplo: «06 servicios».">
            <Input value={draft.services.note} onChange={(e) => set('services', { note: e.target.value })} />
          </Field>
          <ListEditor<HomeCard>
            items={draft.services.items}
            onChange={(items) => set('services', { items })}
            blank={() => ({ icon: 'shield', title: '', desc: '' })}
            addLabel="Añadir tarjeta"
            render={(item, update) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Título">
                    <Input value={item.title} onChange={(e) => update({ title: e.target.value })} />
                  </Field>
                  <Field label="Icono">
                    <Select value={item.icon} onChange={(e) => update({ icon: e.target.value })}>
                      {SERVICE_ICONS.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Texto">
                  <Textarea rows={2} value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </Block>

        <Block title="Cómo trabajamos" hint="Los pasos numerados sobre fondo verde claro.">
          <Heading
            title={draft.steps.title}
            accent={draft.steps.titleAccent}
            onTitle={(v) => set('steps', { title: v })}
            onAccent={(v) => set('steps', { titleAccent: v })}
          />
          <ListEditor<HomeStep>
            items={draft.steps.items}
            onChange={(items) => set('steps', { items })}
            blank={() => ({ n: String(draft.steps.items.length + 1).padStart(2, '0'), title: '', desc: '' })}
            addLabel="Añadir paso"
            render={(item, update) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                  <Field label="Número">
                    <Input value={item.n} onChange={(e) => update({ n: e.target.value })} />
                  </Field>
                  <Field label="Título">
                    <Input value={item.title} onChange={(e) => update({ title: e.target.value })} />
                  </Field>
                </div>
                <Field label="Texto">
                  <Textarea rows={2} value={item.desc} onChange={(e) => update({ desc: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </Block>

        <Block title="Franja de urgencia" hint="La banda verde oscura con el botón de WhatsApp.">
          <Field label="Título" hint="Puedes usar dos líneas: el salto se respeta en pantallas grandes.">
            <Textarea rows={2} value={draft.urgency.title} onChange={(e) => set('urgency', { title: e.target.value })} />
          </Field>
          <Field label="Texto">
            <Textarea rows={2} value={draft.urgency.text} onChange={(e) => set('urgency', { text: e.target.value })} />
          </Field>
          <Field label="Botón">
            <Input value={draft.urgency.cta} onChange={(e) => set('urgency', { cta: e.target.value })} />
          </Field>
        </Block>

        <Block
          title="Contacto"
          hint="El titular y el texto junto al formulario. El teléfono, el correo y la dirección se editan en «Contacto y redes»."
        >
          <Heading
            title={draft.contact.title}
            accent={draft.contact.titleAccent}
            onTitle={(v) => set('contact', { title: v })}
            onAccent={(v) => set('contact', { titleAccent: v })}
          />
          <Field label="Texto">
            <Textarea rows={2} value={draft.contact.text} onChange={(e) => set('contact', { text: e.target.value })} />
          </Field>
        </Block>

        <Block title="Cómo se ve en Google" hint="Título y descripción de la portada en los resultados de búsqueda.">
          <Field label="Título SEO" hint="Lo ideal es no pasar de 60 caracteres.">
            <Input value={draft.seo.title} onChange={(e) => set('seo', { title: e.target.value })} />
          </Field>
          <Field label="Descripción SEO" hint="Entre 120 y 160 caracteres.">
            <Textarea
              rows={3}
              value={draft.seo.description}
              onChange={(e) => set('seo', { description: e.target.value })}
            />
          </Field>
        </Block>
      </div>

      {/* Barra de guardado siempre a mano: el formulario es largo. */}
      <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center gap-3 border-t-2 border-neutral-200 bg-neutral-100/95 py-3 backdrop-blur">
        <Button onClick={save} disabled={busy || !changed.length}>
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        <span className="text-xs text-neutral-500">
          {changed.length
            ? `${changed.length} bloque${changed.length === 1 ? '' : 's'} sin guardar`
            : 'Todo guardado'}
        </span>
      </div>
    </div>
  )
}

/* ── Sección ─────────────────────────────────────────────────────────── */

export default function HomeEditor() {
  const [tab, setTab] = useState<'contenido' | 'novedades'>('contenido')

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
      active
        ? 'border-b-2 border-vetlain-green bg-white text-vetlain-green-dark'
        : 'border-b-2 border-transparent text-neutral-500 hover:text-vetlain-ink'
    }`

  return (
    <div>
      <PageHeading
        title="Portada"
        description="Todo lo que se ve en la página de inicio: textos, imagen del hero, tarjetas y novedades."
      />

      <div className="mb-5 flex gap-1 border-b-2 border-neutral-200">
        <button type="button" className={tabClass(tab === 'contenido')} onClick={() => setTab('contenido')}>
          Contenido
        </button>
        <button type="button" className={tabClass(tab === 'novedades')} onClick={() => setTab('novedades')}>
          Novedades
        </button>
      </div>

      {tab === 'contenido' ? <ContentTab /> : <NewsEditor />}
    </div>
  )
}
