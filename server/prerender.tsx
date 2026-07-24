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
 * La home ("/") NO se prerenderiza: ya tiene meta/JSON-LD estáticos en
 * index.html y su contenido es mayormente marketing fijo, no datos de la BD.
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
  getPublishedBlogPosts,
} from './content.js'
import { SiteContentProvider } from '../src/lib/site-content'
import { PageViewBody } from '../src/pages/site/PageView'
import { ServiciosIndexBody } from '../src/pages/site/ServiciosIndex'
import { ServiceDetailBody } from '../src/pages/site/ServiceDetail'
import { BlogListBody } from '../src/pages/site/BlogList'
import { BlogPostBody } from '../src/pages/site/BlogPost'
import type { Page, Service, BlogPost } from '../src/lib/types'

const DIST = join(process.cwd(), 'dist')

type Route = { path: string; element: ReactElement }

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
  // Sin conexión a la base: se omite el prerender, el sitio sigue 100% client-rendered.
  try {
    getDatabaseUrl()
  } catch {
    console.warn('[prerender] Sin variables de Postgres: se omite (sitio 100% client-rendered).')
    return
  }

  const templatePath = join(DIST, 'index.html')
  if (!existsSync(templatePath)) {
    console.warn('[prerender] No existe dist/index.html todavía. Se omite.')
    return
  }
  const template = readFileSync(templatePath, 'utf-8')

  let siteContentMap: Record<string, unknown> = {}
  const pagesBySlug = new Map<string, Page>()
  let services: Service[] = []
  let posts: BlogPost[] = []

  try {
    const [contentMap, pageRows, serviceRows, postRows] = await Promise.all([
      getSiteContentMap(),
      getAllPages(),
      getPublishedServices(),
      getPublishedBlogPosts(),
    ])
    siteContentMap = contentMap
    for (const row of pageRows) pagesBySlug.set(row.slug, toJsonSafe<Page>(row))
    services = serviceRows.map((s) => toJsonSafe<Service>(s))
    posts = postRows.map((p) => toJsonSafe<BlogPost>(p))
  } catch (err) {
    console.error('[prerender] No se pudo leer la base de datos; se omite el prerender:', err)
    return
  }

  const wrap = (children: ReactElement) => <SiteContentProvider initial={siteContentMap}>{children}</SiteContentProvider>

  const routes: Route[] = [
    {
      path: '/servicios',
      element: wrap(
        <ServiciosIndexBody page={pagesBySlug.get('servicios') ?? null} services={services} loading={false} error={null} />,
      ),
    },
    ...services.map((s) => ({
      path: `/servicios/${s.slug}`,
      element: wrap(<ServiceDetailBody slug={s.slug} data={s} />),
    })),
    ...['nosotros', 'cobertura', 'preguntas-frecuentes', 'contacto'].map((slug) => ({
      path: `/${slug}`,
      element: wrap(<PageViewBody slug={slug} data={pagesBySlug.get(slug) ?? null} loading={false} />),
    })),
    {
      path: '/blog',
      element: wrap(<BlogListBody page={pagesBySlug.get('blog') ?? null} posts={posts} loading={false} error={null} />),
    },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      element: wrap(<BlogPostBody slug={p.slug} data={p} />),
    })),
  ]

  let written = 0
  for (const route of routes) {
    try {
      written += renderRoute(route, template) ? 1 : 0
    } catch (err) {
      console.error(`[prerender] Falló ${route.path}, se omite esa página:`, err)
    }
  }

  console.log(`[prerender] ${written}/${routes.length} páginas generadas como HTML estático.`)
}

function renderRoute(route: Route, template: string): boolean {
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

  const outDir = join(DIST, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), out, 'utf-8')
  return true
}

main().catch((err) => {
  // El prerender es un extra de SEO: nunca debe romper el deploy del sitio.
  console.error('[prerender] Error inesperado, se omite:', err)
})
