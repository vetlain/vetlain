# Prototipo 2 — Sitio Vetlain · DESIGN.md

**Identidad real de la marca, sitio completo.** Toma el logo, la paleta y la
voz reales de Vetlain y las lleva a un sitio institucional completo con un
sistema visual preciso y "de catálogo técnico".

- **Registro:** brand / sitio institucional (el diseño ES el producto).
- **Referencia estética:** índice de catálogo industrial + diseño sistemático
  suizo, teñido de un verde natural (eco). **NO** revista editorial
  (serif italic + drop caps): esa lane se evita a propósito.
- **Personalidad en 3 palabras:** preciso · natural · confiable.

---

## Paleta

Identidad real extraída del logo (`public/brand/`). Estrategia **restrained
con convicción**: carbón como tinta estructural, verde como color de marca.

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| Marca (verde) | `vetlain-green` | `#3d8b40` | Marca, marcadores, tints, estado activo. **No** para texto pequeño sobre blanco (≈3.6:1). |
| Verde oscuro | `vetlain-green-dark` | `#2c6a31` | Botones (texto blanco 5.4:1), códigos, texto verde sobre claro. |
| Verde profundo | `vetlain-green-deep` | `#1e4d24` | Acentos más densos, hover de botón. |
| Verde tinte | `vetlain-green-tint` | `#eef4ec` | Fondos de sección suaves. |
| Carbón (tinta) | `vetlain-ink` | `#1a1a1a` | Titulares, secciones oscuras (footer), wordmark "LAIN". |
| Carbón suave | `vetlain-ink-soft` | `#2e2e2e` | Superficies oscuras secundarias. |
| Grises | `neutral-*` (Tailwind) | — | Cuerpo `neutral-600`, secundario `neutral-500` (pisos de contraste). |
| Superficie | `white` | `#ffffff` | Fondo base. |

**Regla de contraste:** cuerpo ≥ 4.5:1. Verde de marca solo en titulares
grandes/bold o elementos decorativos; para texto usar `green-dark`.

## Tipografía

Eje de contraste real (no dos sans parecidas):

- **Archivo** (grotesca ingenieril) — titulares, nombres, cuerpo.
  Clase `.p2` (definida en `src/index.css`).
- **Martian Mono** — SOLO datos técnicos reales: códigos de producto
  (`R-01`), contadores, metadata, etiquetas de formulario. Clase `.p2-mono`.
  Justificado porque son literalmente números de parte, no "disfraz técnico".
- Números tabulares (`tabular-nums`) en todo dato/código.
- Titular display: `clamp()` con máx ≈ 4.5rem, tracking `-0.03em`, `text-balance`.

## Logo

- Header: logo a color sobre blanco (`/brand/logo-recortado.png`).
- Footer (fondo carbón): mismo logo con filtro `brightness-0 invert` → blanco.
- Isotipo (gota+hoja) `/brand/logo-mark.png` para favicon/acentos compactos.
- Nunca recolorear el logo salvo la inversión monocroma para fondos oscuros.

## Componentes y layout

- **Índice de catálogo:** filas con código (mono, verde-dark) + glifo de
  categoría + nombre + descriptor, separadas por hairline. Alineación a
  baseline código↔nombre. Filtro por categoría con contadores en vivo.
- **Servicios:** lista sistemática (glifo + título + descriptor) separada por
  hairlines, 2 columnas en desktop. **No** grid de cards idénticas.
- **Hero:** dos columnas, statement + slogan real + CTAs + foto real de planta.
- **Confianza:** logos de clientes reales (grayscale → color en hover) + ISO 9001.
- **Nosotros:** relato + enfoque ambiental + datos (ISO, cobertura) + foto.
- **Contacto:** formulario (nombre, email, teléfono, mensaje) con labels
  visibles, validación en blur, estado de éxito; + datos de contacto reales.
- **Footer:** fondo carbón, logo invertido, navegación, contacto, redes.

## Motion

- Entrada escalonada de filas del índice (`.p2-row`, 460ms ease-out-quart),
  con fallback `prefers-reduced-motion: reduce`.
- Hover de fila: tinte de fondo + glifo pasa a verde (200ms).
- Sin bounce, sin animar layout.

## Anti-patrones (prohibido)

- Volver al azul del informe: el azul NO es la marca (es del reporte de auditoría).
- Serif editorial + italic + drop caps (lane de IA saturada).
- Side-stripe borders, gradient text, glassmorphism decorativo.
- Grid de cards idénticas (icono + título + texto repetido).
- Eyebrows uppercase tracked encima de cada sección.
- Verde de marca como texto de cuerpo sobre blanco (falla contraste).
