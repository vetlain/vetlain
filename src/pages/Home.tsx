import { Link } from 'react-router-dom'

const prototipos = [
  {
    to: '/prototipo-1',
    title: 'Prototipo 1',
    desc: 'Confianza Corporativa — sitio B2B completo, azul Trust & Authority',
  },
  {
    to: '/prototipo-2',
    title: 'Prototipo 2',
    desc: 'Sitio completo — identidad real (verde/carbón), catálogo técnico',
  },
  {
    to: '/prototipo-3',
    title: 'Prototipo 3',
    desc: 'Terreno Rápido — angular, verde/carbón (formato P3 + colorimetría P2)',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-vetlain-bg text-slate-800 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xl font-semibold text-vetlain-blue">vetlain</span>
          <span className="text-sm text-slate-500">Rediseño — panel de prototipos</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-semibold text-vetlain-blue mb-2">
          Prototipos de rediseño
        </h1>
        <p className="text-slate-500 mb-12 max-w-xl">
          Tres propuestas visuales independientes para el nuevo sitio de Vetlain.
          Elegí una para revisarla.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {prototipos.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-vetlain-blue hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vetlain-blue/10 text-vetlain-blue font-semibold group-hover:bg-vetlain-blue group-hover:text-white transition">
                {p.title.split(' ')[1]}
              </div>
              <h2 className="mt-4 font-semibold text-slate-800">{p.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
              <span className="mt-4 inline-block text-sm font-medium text-vetlain-blue">
                Ver prototipo →
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        vetlain.cl · panel interno de prototipos, no indexado
      </footer>
    </div>
  )
}
