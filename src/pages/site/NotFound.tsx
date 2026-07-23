/** Página 404 (no indexable). */
import { Link } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { SiteShell, PageHero, PageState } from './parts'

export default function NotFound() {
  return (
    <SiteShell scrollKey="404">
      <Seo title="Página no encontrada" noindex />
      <PageHero crumbs={[{ label: 'Error 404' }]} kicker="Error 404" title="Página no encontrada" />
      <PageState>
        La página que buscas no existe o fue movida.{' '}
        <Link to="/" className="font-bold text-vetlain-green-dark underline">
          Volver al inicio
        </Link>
        .
      </PageState>
    </SiteShell>
  )
}
