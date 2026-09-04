/**
 * Genera HTML estático para las páginas de contenido (servicios, nosotros,
 * cobertura, FAQ, contacto, blog) a partir de la base de datos. Se ejecuta como
 * parte de `npm run build`, DESPUÉS de `vite build` (necesita dist/index.html
 * como plantilla).
 *
 * Por qué: la función serverless de Vercel ya nos dio dos sustos (extensiones
 * ESM, nombres de variables de Neon). Generar HTML en el paso de build (un
 * entorno Node estándar) es mucho más robusto que renderizar en cada request.
 *
 * Es deliberadamente tolerante a fallos: si no hay conexión a la base o algo
 * sale mal, se registra una advertencia y el build sigue — esas rutas quedan
 * serviditas por el SPA normal (client-rendered), como antes de esta fase.
 *
 * La portada ("/") también se prerenderiza: desde que sus textos, imágenes y
 * novedades salen de la base (site_content grupo "home" + tabla news), el HTML
 * estático es la única forma de que un buscador los vea. Como el resultado pisa
 * dist/index.html, antes se guarda una copia intacta de la plantilla en
 * dist/app.html: ese es el shell al que Vercel manda las rutas sin HTML propio
 * (ver los rewrites de vercel.json).
 */
import 'dotenv/config'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import type { ReactElement } from 'react'

import { getDatabaseUrl } from './env.js'
import {
  getSiteContentMap,
  getAllPages,
  getPublishedServices,
  getPublishedProducts,
  getPublishedNews,
  getPublishedBlogPosts,
} from './content.js'
import { SiteContentProvider } from '../src/lib/site-content'
import { Prototipo3Body } from '../src/pages/Prototipo3'
import { NewsDetailBody } from '../src/pages/site/NewsDetail'
import { PageViewBody } from '../src/pages/site/PageView'
import { ServiciosIndexBody } from '../src/pages/site/ServiciosIndex'
import { ServiceDetailBody } from '../src/pages/site/ServiceDetail'
import { ProductosIndexBody } from '../src/pages/site/ProductosIndex'
import { ProductDetailBody } from '../src/pages/site/ProductDetail'
import { BlogListBody } from '../src/pages/site/BlogList'
import { BlogPostBody } from '../src/pages/site/BlogPost'
import type { Page, Service, Product, News, BlogPost } from '../src/lib/types'

const DIST = join(process.cwd(), 'dist')

type Route = {
  path: string
  element: ReactElement
  /**
   * Respuestas de /api que esta página pediría al montar, ya resueltas. Se
   * incrustan en el HTML para que el cliente arranque con ellas en vez de
   * partir en blanco y pisar por un instante el contenido ya renderizado
   * (ver src/lib/bootstrap.ts).
   */
  api?: Record<string, unknown>
}

/**
 * Los tipos del frontend (Page/Service/BlogPost) esperan fechas como string,
 * igual que las entrega `res.json()` en la API real. Drizzle devuelve objetos
 * Date; esto normaliza los resultados del prerender para que sean idénticos
 * a lo que el cliente recibiría por fetch (misma serialización JSON).
 */
function toJsonSafe<T>(row: unknown): T {
  return JSON.parse(JSON.stringify(row)) as T
}

async function main() {
  const templatePath = join(DIST, 'index.html')
  if (!existsSync(templatePath)) {
    console.warn('[prerender] No existe dist/index.html todavía. Se omite.')
    return
  }
  const template = readFileSync(templatePath, 'utf-8')

  // Shell del SPA para las rutas sin HTML propio (/vzgroups, 404…). Se escribe
  // SIEMPRE y antes que nada: vercel.json redirige ahí todo lo que no tenga
  // fichero propio, así que debe existir aunque el prerender no llegue a correr.
  writeFileSync(join(DIST, 'app.html'), template, 'utf-8')

  // Sin conexión a la base: se omite el prerender, el sitio sigue 100% client-rendered.
  try {
    getDatabaseUrl()
  } catch {
    console.warn('[prerender] Sin variables de Postgres: se omite (sitio 100% client-rendered).')
    return
  }

  let siteContentMap: Record<string, unknown> = {}
  const pagesBySlug = new Map<string, Page>()
  let services: Service[] = []
  let products: Product[] = []
  let news: News[] = []
  let posts: BlogPost[] = []

  try {
    const [contentMap, pageRows, serviceRows, productRows, newsRows, postRows] = await Promise.all([
      getSiteContentMap(),
      getAllPages(),
      getPublishedServices(),
      getPublishedProducts(),
      // Aparte del resto: si la tabla `news` todavía no existe (deploy anterior
      // a la migración 0003) la portada sale sin novedades, pero el prerender
      // del sitio entero no se cae por eso.
      Promise.resolve(getPublishedNews()).catch((err: unknown) => {
        console.warn('[prerender] Sin novedades (¿falta la migración 0003_news?):', err)
        return []
      }),
      getPublishedBlogPosts(),
    ])
    siteContentMap = contentMap
    for (const row of pageRows) pagesBySlug.set(row.slug, toJsonSafe<Page>(row))
    services = serviceRows.map((s) => toJsonSafe<Service>(s))
    products = productRows.map((p) => toJsonSafe<Product>(p))
    news = newsRows.map((n) => toJsonSafe<News>(n))
    posts = postRows.map((p) => toJsonSafe<BlogPost>(p))
  } catch (err) {
    console.error('[prerender] No se pudo leer la base de datos; se omite el prerender:', err)
    return
  }

  const wrap = (children: ReactElement) => <SiteContentProvider initial={siteContentMap}>{children}</SiteContentProvider>

  const routes: Route[] = [
    { path: '/', element: wrap(<Prototipo3Body news={news} />), api: { '/news': news } },
    // Sólo las novedades con entrada propia tienen página que generar.
    ...news
      .filter((n) => n.mode === 'entry' && n.slug)
      .map((n) => ({
        path: `/novedades/${n.slug}`,
        element: wrap(<NewsDetailBody slug={n.slug!} data={n} />),
        api: { [`/news/${n.slug}`]: n },
      })),
    {
      path: '/servicios',
      element: wrap(
        <ServiciosIndexBody page={pagesBySlug.get('servicios') ?? null} services={services} loading={false} error={null} />,
      ),
      api: { '/pages/servicios': pagesBySlug.get('servicios') ?? null, '/services': services },
    },
    ...services.map((s) => ({
      path: `/servicios/${s.slug}`,
      element: wrap(<ServiceDetailBody slug={s.slug} data={s} />),
      api: { [`/services/${s.slug}`]: s },
    })),
    {
      path: '/productos',
      element: wrap(
        <ProductosIndexBody page={pagesBySlug.get('productos') ?? null} products={products} loading={false} error={null} />,
      ),
      api: { '/pages/productos': pagesBySlug.get('productos') ?? null, '/products': products },
    },
    ...products.map((p) => ({
      path: `/productos/${p.slug}`,
      element: wrap(<ProductDetailBody slug={p.slug} data={p} />),
      api: { [`/products/${p.slug}`]: p },
    })),
    ...['nosotros', 'cobertura', 'preguntas-frecuentes', 'contacto'].map((slug) => ({
      path: `/${slug}`,
      element: wrap(<PageViewBody slug={slug} data={pagesBySlug.get(slug) ?? null} loading={false} />),
      api: { [`/pages/${slug}`]: pagesBySlug.get(slug) ?? null },
    })),
    {
      path: '/blog',
      element: wrap(<BlogListBody page={pagesBySlug.get('blog') ?? null} posts={posts} loading={false} error={null} />),
      api: { '/pages/blog': pagesBySlug.get('blog') ?? null, '/blog': posts },
    },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      element: wrap(<BlogPostBody slug={p.slug} data={p} />),
      api: { [`/blog/${p.slug}`]: p },
    })),
  ]

  let written = 0
  for (const route of routes) {
    try {
      written += renderRoute(route, template, siteContentMap) ? 1 : 0
    } catch (err) {
      console.error(`[prerender] Falló ${route.path}, se omite esa página:`, err)
    }
  }

  console.log(`[prerender] ${written}/${routes.length} páginas generadas como HTML estático.`)
}

/**
 * Serializa el payload para incrustarlo en un <script>. Escapar `<` evita que
 * un `</script>` dentro de los textos del panel corte la etiqueta.
 */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function renderRoute(route: Route, template: string, content: Record<string, unknown>): boolean {
  const helmetContext: { helmet?: HelmetServerState } = {}
  const app = (
    <StaticRouter location={route.path}>
      <HelmetProvider context={helmetContext}>{route.element}</HelmetProvider>
    </StaticRouter>
  )
  const html = renderToStaticMarkup(app)
  const helmet = helmetContext.helmet
  const headExtra = helmet
    ? [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()].join('\n')
    : ''

  let out = template
    // Quita el <title> y la meta description genéricos: Helmet aporta los de esta página.
    .replace(/<title>.*?<\/title>/s, '')
    .replace(/<meta\s+name="description"[^>]*\/?>/s, '')
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  if (headExtra) out = out.replace('</head>', `${headExtra}\n  </head>`)

  // Estado inicial para el cliente: exactamente el contenido que este HTML ya
  // muestra, para que al montar no parpadee con los valores por defecto.
  const bootstrap = serialize({ path: route.path, content, api: route.api ?? {} })
  out = out.replace(
    '</body>',
    `  <script id="__vetlain_data__" type="application/json">${bootstrap}</script>\n  </body>`,
  )

  const outDir = join(DIST, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), out, 'utf-8')
  return true
}

main().catch((err) => {
  // El prerender es un extra de SEO: nunca debe romper el deploy del sitio.
  console.error('[prerender] Error inesperado, se omite:', err)
})
