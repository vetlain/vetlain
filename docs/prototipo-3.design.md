# Prototipo 3 — Terreno Rápido · DESIGN.md

**Landing de conversión rápida, estética de señalética de peligro.** Para
clientes residenciales y pymes que tienen una plaga *ahora* y quieren
resolverla ya. Mobile-first, urgencia, CTA de WhatsApp/llamada omnipresente.

- **Registro:** producto / landing de conversión (el diseño SIRVE a la acción).
- **Base técnica:** a medida en **Tailwind v3** (sin shadcn, sin migrar a v4;
  decisión del usuario para no arriesgar P1/P2). Todo angular.
- **Personalidad en 3 palabras:** urgente · directo · sin vueltas.

---

## Paleta — colorimetría clásica de control de plagas (hazard)

Negro + rojo + amarillo: el código cromático de la señalética de peligro y las
cintas de precaución. Tokens propios en `tailwind.config.js` (grupo `hazard`),
distintos de P1 (azul) y P2 (verde/carbón).

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| Negro base | `hazard-black` | `#0c0c0c` | Fondo dominante. |
| Negro superficie | `hazard-ink` | `#171717` | Tarjetas/superficies. |
| Rojo peligro | `hazard-red` | `#e11414` | CTAs, acción, urgencia. Texto blanco encima (≈4.6:1). |
| Rojo oscuro | `hazard-red-dark` | `#a10f0f` | Hover de CTA. |
| Amarillo caución | `hazard-yellow` | `#f7c600` | Acentos, cintas, highlights. **Texto negro encima.** |
| Amarillo brillante | `hazard-yellow-bright` | `#ffd21a` | Realces puntuales. |
| Texto claro | `neutral-100/300` | — | Cuerpo sobre negro. |

**Contraste:** amarillo SIEMPRE con texto negro; rojo con texto blanco;
cuerpo en gris claro sobre negro. Nunca amarillo sobre blanco.

## Estética angular (regla dura)

- **Cero border-radius.** Nada de `rounded-*`. Esquinas rectas siempre.
- Cortes en ángulo con `clip-path` (tags, chevrons, badges, bordes de sección).
- Bordes sólidos gruesos (2–4px).
- **Motivo hazard:** cinta diagonal negro/amarillo
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
- Reusar azul (P1) o verde (P2).
- Amarillo como texto sobre fondo claro (falla contraste).
- Gradient text, glassmorphism, side-stripe borders (usar borde completo o cinta).
