# Prototipo 3 — Terreno Rápido · DESIGN.md

**Landing de conversión rápida, estética angular de señalética** sobre fondo
blanco, con verde/carbón (la colorimetría real de la marca) como acento. Para
clientes residenciales y pymes que tienen una plaga *ahora* y quieren
resolverla ya. Mobile-first, urgencia, CTA de WhatsApp/llamada omnipresente.
Es la propuesta que quedó como sitio principal: se sirve en la URL raíz.

- **Registro:** producto / landing de conversión (el diseño SIRVE a la acción).
- **Base técnica:** a medida en **Tailwind v3** (sin shadcn, sin migrar a v4;
  decisión del usuario para no arriesgar P1/P2). Todo angular.
- **Personalidad en 3 palabras:** urgente · directo · sin vueltas.

---

## Paleta — colorimetría del Prototipo 2 (verde + carbón sobre blanco)

> **Decisión del cliente (jul 2026):** conservar el formato angular de P3 pero
> con la colorimetría de P2, que es un sistema **de fondo blanco** (no el
> carbón oscuro que se probó primero). La paleta hazard original
> (negro/rojo/amarillo) quedó en el historial de git. Los tokens son los del
> grupo `vetlain.*` compartido con P2; los roles se mapean así:

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| Fondo base | `white` | `#ffffff` | Fondo dominante (hero, servicios, contacto, header). |
| Fondo suave | `vetlain-green-tint` | `#eef4ec` | Secciones alternas (tira de confianza, "cómo trabajamos"). |
| Carbón ancla | `vetlain-ink` | `#1a1a1a` | Footer y barra sticky mobile; titulares y bordes fuertes sobre blanco. |
| Verde acción | `vetlain-green-dark` | `#2c6a31` | CTAs y banda de urgencia. Texto blanco encima (6.5:1). |
| Verde acción hover | `vetlain-green-deep` | `#1e4d24` | Hover de CTA. |
| Verde marca | `vetlain-green` | `#3d8b40` | Acentos display grandes, cintas, glifos, bordes activos. **No** para texto pequeño (≈4.2:1 sobre blanco, solo ≥3:1). |
| Cuerpo | `neutral-600` | `#525252` | Texto de párrafo sobre blanco (≈7:1). |
| Bordes | `neutral-200/300` | — | Bordes de tarjetas e inputs sobre blanco. |

**Ritmo de secciones:** blanco → verde-tinte → blanco → verde-tinte → banda
verde-dark (drench) → blanco → footer carbón. Dos anclas oscuras (la banda de
urgencia verde y el footer carbón); el resto es blanco/verde-tinte, igual que P2.

**Contraste:** CTAs siempre en `green-dark` con texto blanco; `vetlain-green`
solo en display grande, iconos o decoración; cuerpo en `neutral-600` sobre
blanco (o blanco/`white/90` sobre las anclas verdes/carbón).

**Motivo cinta:** la cinta diagonal pasa de negro/amarillo a
**verde `#3d8b40` / carbón `#1a1a1a`** (`.p3-tape`); funciona como divisor
sobre blanco y bordea la banda de urgencia y el footer.

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

1. Barra superior blanca (sticky): logo a color + borde inferior verde + CTAs.
2. Hero blanco: titular enorme (acento verde), subcopy, CTAs WhatsApp/Llamar,
   foto angular con sombra verde offset. Cinta verde/carbón al cierre.
3. Tira de confianza (verde-tinte): ISO 9001 · Talagante · respuesta mismo día.
4. Servicios blanco: tarjetas angulares (borde `neutral-200`, glifo en tile verde).
5. Cómo trabajamos (verde-tinte): 3 pasos numerados (tag verde-dark).
6. Banda de urgencia (verde-dark, drench) con CTA carbón, entre dos cintas.
7. Contacto rápido blanco: teléfono + WhatsApp + form mínimo.
8. Footer carbón angular (logo invertido a blanco).
9. **CTA sticky de WhatsApp/Llamar** fijo abajo en mobile (barra carbón/verde).

## Motion

- Cintas sutiles; hover de tarjetas cambia el borde a verde.
- Sin bounce; respetar `prefers-reduced-motion`.

## Logo

- Header (blanco): logo a color, sin filtros.
- Footer y barra sticky (carbón): logo `brightness-0 invert` → blanco. No recolorear.

## Anti-patrones (prohibido)

- Cualquier `rounded-*` o esquina redondeada.
- Reusar el azul (P1) o la paleta hazard original (negro/rojo/amarillo).
- `vetlain-green` como texto pequeño sobre blanco (usar `green-dark`).
- Gradient text, glassmorphism, side-stripe borders (usar borde completo o cinta).
