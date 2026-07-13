import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Prototipo1 from './pages/Prototipo1'
import Prototipo2 from './pages/Prototipo2'
import Prototipo3 from './pages/Prototipo3'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prototipo-1" element={<Prototipo1 />} />
      <Route path="/prototipo-2" element={<Prototipo2 />} />
      <Route path="/prototipo-3" element={<Prototipo3 />} />
    </Routes>
  )
}
