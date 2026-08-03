# Sistema de diseño — Prototipos Vetlain

Este repositorio contiene **3 prototipos de rediseño** para vetlain.cl
(control de plagas / control y mantención ambiental, Talagante).

**Estado (jul 2026):** el cliente eligió el **Prototipo 3** (formato angular
+ colorimetría verde/carbón de P2 sobre blanco). La **URL raíz (`/`) ahora
muestra el P3** directamente; P1 y P2 quedaron fuera de la navegación (siguen
accesibles solo escribiendo `/#/prototipo-1` o `/#/prototipo-2`). El antiguo
panel de selección (`Home.tsx`) ya no se rutea.

## Principio: cada prototipo es una identidad propia

Cada prototipo tiene **su propia paleta, tipografía y personalidad**. No son
secciones del mismo sitio ni variantes del mismo diseño: son propuestas
distintas y competidoras. Por eso cada uno tiene su archivo de diseño:

| Prototipo | Ruta | Documento | Identidad |
|-----------|------|-----------|-----------|
| 1 · Confianza Corporativa | `/prototipo-1` | _(sin doc formal)_ | Azul corporativo B2B |
| 2 · Sitio Vetlain (identidad real) | `/prototipo-2` | [`prototipo-2.design.md`](./prototipo-2.design.md) | Verde + carbón (marca real) |
| 3 · Terreno Rápido **(elegido, en `/`)** | `/` y `/prototipo-3` | [`prototipo-3.design.md`](./prototipo-3.design.md) | Angular, verde + carbón sobre blanco (formato P3 + colorimetría P2) |

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

## Contenido migrado desde el sitio antiguo

Se transcribió el contenido de `vetlain.cl/servicios/` y `vetlain.cl/productos/`
para que la web nueva ofrezca lo mismo que la original:

- **Servicios** (`/servicios`): los textos originales de *Control de Roedores*,
  *Control de Insectos* y *Control de Aves* pasaron al `bodyMd` de las fichas
  existentes, y se creó la ficha nueva **Capacitaciones**. Los 6 rubros
  (*Espacios Comunes, Bodegas, Oficinas, Control Externo de Plagas, Plantas
  Alimentarias, Casinos*) se listan en la ficha *Empresas y bodegas* y como
  sección con imágenes en el índice.
- **Productos** (`/productos`, `/productos/:slug`): tabla `products` nueva, con
  los **17 productos** del catálogo original agrupados en 3 categorías
  (roedores / insectos / aves). Editable desde el panel en *Productos*.
- **Imágenes**: descargadas del sitio antiguo a `public/brand/productos/` (17)
  y `public/brand/sectores/` (6).

### Secciones estáticas (no editables desde el panel)

Viven en `src/pages/site/parts.tsx` y sólo se cambian tocando ese archivo:

| Componente | Dónde | Qué es |
|---|---|---|
| `ServicePillars` | `/servicios` | Los 3 pilares del sitio original (Técnicos Certificados / El mejor Servicio / Mejora Continua). |
| `ServiceSectors` | `/servicios` | Los 6 rubros con foto. |
| `TrustedClients` | `/servicios` | **"Han confiado en nosotros"** — logos de Aristía, Brüggen, Huentelauquén, Pacífico Sur y Puratos. Estático por pedido del cliente. |

### Cargar el contenido en la base

El seed inserta sólo lo que falta y **nunca pisa** lo que el cliente editó en el
panel. Para re-sincronizar servicios, páginas y productos con el texto del
código (por ejemplo, la primera vez tras esta migración) hay que forzarlo:

```bash
npm run db:migrate      # crea la tabla products (migración 0002)
npm run db:seed:force   # inserta los 17 productos y actualiza servicios/páginas
```

En Vercel, donde no hay terminal, el equivalente es visitar una vez:

```
/api/setup?token=EL_SETUP_TOKEN&overwrite=1
```

Después conviene pulsar **Publicar cambios** en el panel para que el prerender
regenere el HTML estático de `/productos` y las fichas nuevas.

## Portada editable (sección «Portada» del panel)

Desde `/admin/portada` el cliente edita **toda** la home, sin tocar código.

**Dónde vive cada cosa**

| Pieza | Almacenamiento | Editor |
|---|---|---|
| Textos, botones, imagen del hero, tarjetas, franjas y SEO | `site_content`, grupo `home`, una clave por bloque (`home.hero`, `home.services`…) con el objeto completo en `jsonb` | Panel → Portada → *Contenido* |
| Novedades (tarjetas entre el hero y «Qué eliminamos») | tabla `news` | Panel → Portada → *Novedades* |

La estructura de los bloques y sus valores por defecto están en
`src/lib/home-content.ts`. Ese archivo es la **única fuente de verdad**: lo usan
el sitio (como respaldo si la API falla o mientras carga), el panel (para armar
el formulario) y el seed (para poblar la base). Si se añade un campo nuevo a un
bloque, las filas ya guardadas siguen funcionando: el merge rellena lo que falte
con el valor por defecto.

Las novedades sólo aparecen si hay al menos una publicada y la sección está
activada en *Contenido → Novedades (encabezado)*.

### Subida de imágenes

El panel sube fotos con **Vercel Blob** (`POST /api/admin/uploads`, protegido por
sesión). Para que funcione en producción hay que crear una vez el store:

> Vercel → proyecto → *Storage* → **Create Database** → *Blob* → conectarlo al
> proyecto. Eso inyecta `BLOB_READ_WRITE_TOKEN` automáticamente; luego hay que
> redeployar para que la función lo tome.

Sin ese token: en local las imágenes se guardan en `public/uploads/` (ignorado
por git) y en producción el panel avisa de que falta configurarlo — el campo de
texto para pegar una ruta o URL sigue disponible como alternativa.

Formatos aceptados: JPG, PNG, WEBP, GIF y AVIF, hasta 8 MB. SVG queda fuera a
propósito (puede contener scripts y se serviría desde el propio dominio).

### La portada se prerenderiza

Desde que su contenido sale de la base, `/` se genera como HTML estático en cada
build, igual que el resto de páginas. Como el resultado pisa `dist/index.html`,
el build guarda antes una copia intacta de la plantilla en **`dist/app.html`**, y
`vercel.json` manda ahí las rutas sin fichero propio (`/admin`, 404…). Si se
toca `vercel.json` o `server/prerender.tsx`, hay que mantener esa pareja:

- `dist/index.html` → portada prerenderizada (lo que ve Google).
- `dist/app.html` → shell vacío del SPA (fallback de las demás rutas).

Los cambios de contenido se ven **al instante** en el sitio (se leen por API);
el HTML estático se actualiza al pulsar **Publicar cambios**.
