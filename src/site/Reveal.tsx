/**
 * Aparición al hacer scroll (fade + subida), pensada para un sitio prerenderizado:
 *
 * El contenido se renderiza SIEMPRE visible (nada de `opacity-0` en el markup:
 * el HTML estático que lee Google y el usuario sin JS no debe depender de que
 * un script lo revele). Es el propio efecto quien oculta el elemento al montar
 * —solo si está bajo el viewport y el usuario no pidió menos movimiento— y un
 * IntersectionObserver lo revela al entrar en pantalla, una única vez.
 *
 * `delay` escalona los elementos de una misma fila (stagger): en las grillas se
 * pasa `(i % columnas) * paso` para que cada fila entre en cascada.
 */
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export function Reveal({
  delay = 0,
  className = '',
  children,
}: {
  delay?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  // useEffect y no useLayoutEffect: esto también se renderiza en el prerender
  // (renderToString), donde useLayoutEffect emite warnings. Correr tras el paint
  // no se nota: solo se ocultan elementos que aún están fuera del viewport.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return
    // Ya está (o casi está) en pantalla al montar: no se toca. Ocultar algo que
    // el usuario ya vio para volver a mostrárselo es un parpadeo, no un efecto.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    el.style.setProperty('--reveal-delay', `${delay}ms`)
    el.classList.add('reveal-pre')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('reveal-in')
        io.disconnect()
      },
      // Dispara cuando el elemento lleva ~8% de viewport recorrido.
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      el.classList.remove('reveal-pre', 'reveal-in')
    }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
