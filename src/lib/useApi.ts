/** Hook simple de carga GET desde /api con estados loading/error/data. */
import { useEffect, useState } from 'react'

type State<T> = { data: T | null; loading: boolean; error: string | null }

export function useApi<T>(path: string | null): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null })
      return
    }
    let alive = true
    setState({ data: null, loading: true, error: null })
    fetch('/api' + path, { credentials: 'include' })
      .then(async (r) => {
        const body = r.headers.get('content-type')?.includes('application/json') ? await r.json() : null
        if (!r.ok) throw new Error(body?.error ?? `Error ${r.status}`)
        return body as T
      })
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err) => alive && setState({ data: null, loading: false, error: String(err.message ?? err) }))
    return () => {
      alive = false
    }
  }, [path])

  return state
}
