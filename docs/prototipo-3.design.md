# Prototipo 3 — Terreno Rápido · DESIGN.md

**Landing de conversión rápida, estética angular de señalética** (ahora en
verde/carbón, la colorimetría real de la marca). Para
clientes residenciales y pymes que tienen una plaga *ahora* y quieren
resolverla ya. Mobile-first, urgencia, CTA de WhatsApp/llamada omnipresente.

- **Registro:** producto / landing de conversión (el diseño SIRVE a la acción).
- **Base técnica:** a medida en **Tailwind v3** (sin shadcn, sin migrar a v4;
  decisión del usuario para no arriesgar P1/P2). Todo angular.
- **Personalidad en 3 palabras:** urgente · directo · sin vueltas.

---

## Paleta — colorimetría del Prototipo 2 (verde + carbón, identidad real)

> **Decisión del cliente (jul 2026):** conservar el formato de P3 pero con la
> colorimetría de P2. La paleta hazard original (negro/rojo/amarillo) quedó
> registrada en el historial de git. Los tokens son los del grupo `vetlain.*`
> compartido con P2; los roles se mapean así sobre la estructura angular:

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| Carbón base | `vetlain-ink` | `#1a1a1a` | Fondo dominante (reemplaza al negro hazard). |
| Carbón superficie | `vetlain-ink-soft` | `#2e2e2e` | Tarjetas/superficies, con borde `neutral-700`. |
| Verde acción | `vetlain-green-dark` | `#2c6a31` | CTAs y banda de urgencia. Texto blanco encima (5.4:1). |
| Verde acción hover | `vetlain-green-deep` | `#1e4d24` | Hover de CTA. |
| Verde marca | `vetlain-green` | `#3d8b40` | Acentos display grandes, cintas, glifos, bordes activos. **No** para texto pequeño sobre carbón (4.1:1, solo ≥3:1). |
| Verde tinte | `vetlain-green-tint` | `#eef4ec` | Chips claros (texto `green-deep`, 8.8:1) y links de acento pequeños sobre carbón. |
| Texto claro | `neutral-100/300/400` | — | Cuerpo sobre carbón (piso: `neutral-400`). |

**Contraste:** CTAs siempre en `green-dark` con texto blanco (regla del P2);
`vetlain-green` solo en display grande, iconos o decoración sobre carbón;
texto pequeño de acento en `green-tint`; cuerpo en gris claro (mínimo
`neutral-400`) sobre carbón.

**Motivo cinta:** la cinta diagonal pasa de negro/amarillo a
**verde `#3d8b40` / carbón `#1a1a1a`** (`.p3-tape`).

## Estética angular (regla dura)

- **Cero border-radius.** Nada de `rounded-*`. Esquinas rectas siempre.
- Cortes en ángulo con `clip-path` (tags, chevrons, badges, bordes de sección).
- Bordes sólidos gruesos (2–4px).
- **Motivo cinta:** cinta diagonal verde/carbón
  (`repeating-linear-gradient(45deg, …)`) como divisores y acentos.

## Tipografía

- **Anton** — display/titulares, ultra-condensada pesada, uppercase.
  Grito industrial de afiche. Clase `.p3-display`.
- **Barlow** — cuerpo/UI (grotesca utilitaria, tipo patente californiana).
  Clase `.p3` (root).
- Distinta de P1 (Lexend/system) y P2 (Archivo/Martian Mono).
- Titulares en MAYÚSCULAS, tracking apretado; cuerpo en peso medio.

## Estructura (mobile-first, conversión)

1. Barra superior: logo (invertido a blanco) + CTA rojo "LLAMAR".
2. Hero: negro + cinta hazard, titular enorme, subcopy, CTAs WhatsApp/Llamar.
3. Tira de confianza: ISO 9001 · Talagante · respuesta el mismo día.
4. Servicios: tarjetas angulares (borde, negro/amarillo) con glifos.
5. Cómo trabajamos: 3 pasos numerados (Llamas → Evaluamos → Eliminamos).
6. Banda de urgencia (rojo) con CTA.
7. Contacto rápido: teléfono + WhatsApp + form mínimo.
8. Footer negro angular.
9. **CTA sticky de WhatsApp** fijo abajo en mobile.

## Motion

- Cintas hazard sutiles; hover de tarjetas con desplazamiento/relleno amarillo.
- Sin bounce; respetar `prefers-reduced-motion`.

## Logo

- Logo real invertido a blanco (`brightness-0 invert`) sobre negro. No recolorear.

## Anti-patrones (prohibido)

- Cualquier `rounded-*` o esquina redondeada.
- Reusar el azul (P1) o la paleta hazard original (negro/rojo/amarillo).
- `vetlain-green` como texto pequeño sobre carbón o sobre blanco (falla contraste).
- Gradient text, glassmorphism, side-stripe borders (usar borde completo o cinta).
