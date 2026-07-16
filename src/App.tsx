import { Routes, Route } from 'react-router-dom'
import Prototipo1 from './pages/Prototipo1'
import Prototipo2 from './pages/Prototipo2'
import Prototipo3 from './pages/Prototipo3'
import SitePage from './pages/SitePage'
import { sitePages } from './site/nav'

export default function App() {
  return (
    <Routes>
      {/* La raíz muestra directamente el Prototipo 3 (decisión del cliente). */}
      <Route path="/" element={<Prototipo3 />} />
      <Route path="/prototipo-3" element={<Prototipo3 />} />

      {/* Páginas internas (about us, servicios, SEO). Vacías por ahora:
          cada una vive en su URL y renderiza el mismo placeholder. */}
      {sitePages.map((page) => (
        <Route key={page.path} path={page.path} element={<SitePage {...page} />} />
      ))}

      {/* P1 y P2 quedan fuera de la navegación; accesibles solo por URL directa. */}
      <Route path="/prototipo-1" element={<Prototipo1 />} />
      <Route path="/prototipo-2" element={<Prototipo2 />} />
    </Routes>
  )
}
