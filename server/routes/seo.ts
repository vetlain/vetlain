/**
 * robots.txt y sitemap.xml dinámicos.
 * Se registran tanto en /robots.txt y /sitemap.xml (nivel app) como en
 * /api/robots y /api/sitemap, para ser robustos ante cómo Vercel entrega la URL
 * a la función tras el rewrite. El sitemap se arma con las páginas, servicios y
 * entradas publicadas.
 */
import type { Request, Response } from 'express'
import { eq, desc } from 'drizzle-orm'
import { db, schema } from '../db/index.js'

// Dominio canónico del sitio. Fijo a vetlain.cl (override con SITE_URL en Vercel).
function baseUrl(): string {
  return (process.env.SITE_URL || 'https://vetlain.cl').replace(/\/$/, '')
}

export function robotsHandler(_req: Request, res: Response): void {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api',
    '',
    `Sitemap: ${baseUrl()}/sitemap.xml`,
    '',
  ].join('\n')
  res.type('text/plain').send(body)
}

export async function sitemapHandler(_req: Request, res: Response): Promise<void> {
  const base = baseUrl()
  const staticPaths = ['/', '/servicios', '/nosotros', '/cobertura', '/preguntas-frecuentes', '/contacto', '/blog']

  type Entry = { loc: string; lastmod?: string }
  const entries: Entry[] = staticPaths.map((p) => ({ loc: base + p }))

  try {
    const [services, posts] = await Promise.all([
      db.select().from(schema.services).where(eq(schema.services.published, true)),
      db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.status, 'published'))
        .orderBy(desc(schema.blogPosts.publishedAt)),
    ])
    for (const s of services) {
      entries.push({ loc: `${base}/servicios/${s.slug}`, lastmod: s.updatedAt?.toISOString?.() })
    }
    for (const p of posts) {
      entries.push({ loc: `${base}/blog/${p.slug}`, lastmod: (p.updatedAt ?? p.publishedAt)?.toISOString?.() })
    }
  } catch (err) {
    // Sin BD: al menos devolvemos las rutas fijas.
    console.error('[sitemap] sin BD:', err)
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
      .join('\n') +
    '\n</urlset>\n'

  res.type('application/xml').send(xml)
}
