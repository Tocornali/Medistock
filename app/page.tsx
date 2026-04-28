import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-black tracking-tight text-blue-700">
          ¡Next.js está vivo! 🚀
        </h1>
        <p className="text-xl font-medium text-slate-600">
          La estructura base de MEDISTOCK se ha inicializado correctamente y los Server Components están listos.
        </p>

        <div className="pt-8">
          <Link
            href="/catalogo"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200"
          >
            Ir al Catálogo de Insumos
          </Link>
        </div>
      </div>
    </main>
  )
}
