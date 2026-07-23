/** Renderiza Markdown a HTML con la tipografía de marca (.prose-vetlain). */
import { marked } from 'marked'

export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  const html = marked.parse(source, { async: false }) as string
  return <div className={`prose-vetlain ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
