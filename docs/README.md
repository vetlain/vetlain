# Sistema de diseño — Prototipos Vetlain

Este repositorio contiene **3 prototipos de rediseño independientes** para
vetlain.cl (control de plagas / control y mantención ambiental, Talagante).
Se acceden desde la vista raíz (`/`) mediante 3 botones.

## Principio: cada prototipo es una identidad propia

Cada prototipo tiene **su propia paleta, tipografía y personalidad**. No son
secciones del mismo sitio ni variantes del mismo diseño: son propuestas
distintas y competidoras. Por eso cada uno tiene su archivo de diseño:

| Prototipo | Ruta | Documento | Identidad |
|-----------|------|-----------|-----------|
| 1 · Confianza Corporativa | `/prototipo-1` | _(sin doc formal)_ | Azul corporativo B2B |
| 2 · Sitio Vetlain (identidad real) | `/prototipo-2` | [`prototipo-2.design.md`](./prototipo-2.design.md) | Verde + carbón (marca real) |
| 3 · Terreno Rápido | `/prototipo-3` | [`prototipo-3.design.md`](./prototipo-3.design.md) | Angular, verde + carbón (formato P3 + colorimetría P2, pedido del cliente) |

### Reglas de la convención

1. **Antes de construir un prototipo, se define/lee su `*.design.md`.**
   El documento fija paleta, tipografía y componentes ANTES de escribir UI.
2. **Ninguna paleta se repite entre prototipos** (regla original de la fase
   de exploración). *Excepción posterior:* tras revisar los 3 demos, el
   cliente pidió el formato de P3 con la colorimetría de P2, así que P3 hoy
   comparte los tokens verdes/carbón de P2 (la paleta hazard original quedó
   en el historial de git).
3. **Los tokens viven en `tailwind.config.js` con prefijo/comentario por
   prototipo**, para que no se mezclen (`vetlain.blue*` = P1, `vetlain.green*`
   / `vetlain.ink` = P2, etc.).
4. **El objetivo es que, puestos lado a lado, se lean como 3 estudios
   distintos** resolviendo el mismo problema — no como 3 páginas de un sitio.

## Identidad real de la marca (referencia compartida)

Estos son datos verificados del negocio (sirven de insumo, no de estética):

- **Logo:** isotipo de gota de agua con hoja + wordmark "VETLAIN"
  (VET en verde, LAIN en carbón). Tagline: *Control y Mantención Ambiental*.
  Assets reales scrapeados en `public/brand/`.
- **Paleta real:** verde natural `#3d8b40` + carbón `#1a1a1a` + blanco.
- **Slogan:** "Nuestro negocio es mantener el suyo, sin plagas."
- **Certificación:** ISO 9001.
- **Servicios:** control de roedores, insectos y aves; capacitaciones;
  servicios especializados (plantas alimentarias, bodegas, oficinas, casinos).
- **Catálogo:** 17 productos/equipos en 3 categorías.
- **Contacto:** Juana Canales 987, Talagante · +56 2 2815 3975 ·
  +56 9 6830 2857 · vetlain@vetlain.cl · Facebook, Instagram, YouTube, LinkedIn.
- **Clientes:** Aristía, Brüggen, Huentelauquén, Pacífico Sur, Puratos.

> Nota: la portada de vetlain.cl está comprometida (redirect a spam); toda la
> identidad se extrajo de las páginas internas sanas, no del home hackeado.
