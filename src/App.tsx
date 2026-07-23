import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Prototipo1 from './pages/Prototipo1'
import Prototipo2 from './pages/Prototipo2'
import Prototipo3 from './pages/Prototipo3'
import ServiciosIndex from './pages/site/ServiciosIndex'
import ServiceDetail from './pages/site/ServiceDetail'
import PageView from './pages/site/PageView'
import BlogList from './pages/site/BlogList'
import BlogPost from './pages/site/BlogPost'
import NotFound from './pages/site/NotFound'

// El panel se carga aparte (lazy): no lastra el bundle del sitio público.
const AdminApp = lazy(() => import('./admin/AdminApp'))

export default function App() {
  return (
    <Routes>
      {/* La raíz muestra directamente el Prototipo 3 (decisión del cliente). */}
      <Route path="/" element={<Prototipo3 />} />
      <Route path="/prototipo-3" element={<Prototipo3 />} />

      {/* Páginas internas: contenido servido desde la API (editable en el panel). */}
      <Route path="/servicios" element={<ServiciosIndex />} />
      <Route path="/servicios/:slug" element={<ServiceDetail />} />
      <Route path="/nosotros" element={<PageView slug="nosotros" />} />
      <Route path="/cobertura" element={<PageView slug="cobertura" />} />
      <Route path="/preguntas-frecuentes" element={<PageView slug="preguntas-frecuentes" />} />
      <Route path="/contacto" element={<PageView slug="contacto" />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Panel de administración (privado). Maneja su propio login y rutas. */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />

      {/* P1 y P2 quedan fuera de la navegación; accesibles solo por URL directa. */}
      <Route path="/prototipo-1" element={<Prototipo1 />} />
      <Route path="/prototipo-2" element={<Prototipo2 />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
