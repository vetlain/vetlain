/** Contactos recibidos por el formulario del sitio. */
import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { Lead } from '../lib/types'
import { PageHeading, Card, Button, Notice, Loading } from './ui'

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  function reload() {
    return api.get<Lead[]>('/admin/leads').then(setLeads)
  }
  useEffect(() => {
    reload().catch((e) => setMsg(e instanceof ApiError ? e.message : 'No se pudieron cargar los contactos'))
  }, [])

  async function toggle(lead: Lead) {
    const updated = await api.put<Lead>(`/admin/leads/${lead.id}`, { handled: !lead.handled })
    setLeads((list) => list?.map((l) => (l.id === updated.id ? updated : l)) ?? null)
  }

  async function remove(lead: Lead) {
    if (!confirm(`¿Eliminar el contacto de ${lead.name}?`)) return
    await api.del(`/admin/leads/${lead.id}`)
    setLeads((list) => list?.filter((l) => l.id !== lead.id) ?? null)
  }

  if (!leads) return msg ? <Notice kind="error">{msg}</Notice> : <Loading />

  const pending = leads.filter((l) => !l.handled).length

  return (
    <div>
      <PageHeading
        title="Contactos"
        description={
          leads.length
            ? `${leads.length} en total · ${pending} sin atender. Los que llegan desde el formulario del sitio.`
            : 'Aquí aparecen los mensajes que la gente envía desde el formulario del sitio.'
        }
      />

      {leads.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-500">Todavía no hay contactos. Cuando alguien complete el formulario, aparecerá aquí.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className={lead.handled ? 'opacity-60' : ''}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold uppercase tracking-wide text-vetlain-ink">{lead.name}</span>
                    {!lead.handled && (
                      <span className="bg-vetlain-green-tint px-1.5 py-0.5 text-[10px] font-bold uppercase text-vetlain-green-deep">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {formatWhen(lead.createdAt)}
                    {lead.comuna ? ` · ${lead.comuna}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 border-2 border-vetlain-green px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-vetlain-green-dark hover:bg-vetlain-green-tint"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-1 border-2 border-neutral-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-vetlain-ink hover:border-vetlain-ink"
                  >
                    Llamar
                  </a>
                </div>
              </div>

              <p className="mt-2 text-sm text-vetlain-ink">
                <span className="font-semibold">{lead.phone}</span>
              </p>
              {lead.message && <p className="mt-1 text-sm leading-relaxed text-neutral-700">{lead.message}</p>}

              <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3">
                <Button variant="ghost" onClick={() => toggle(lead)}>
                  {lead.handled ? 'Marcar sin atender' : 'Marcar atendido'}
                </Button>
                <Button variant="danger" onClick={() => remove(lead)}>
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
