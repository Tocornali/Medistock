import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 text-slate-900 dark:text-white transition-colors">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-black tracking-tight text-[#1A9089] dark:text-brand-primary">
          ¡Next.js está vivo! 🚀
        </h1>
        <p className="text-xl font-medium text-slate-600 dark:text-slate-400 transition-colors">
          La estructura base de MEDISTOCK se ha inicializado correctamente y los Server Components están listos.
        </p>

        <div className="pt-8">
          <Link
            href="/catalogo"
            className="inline-block px-8 py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-[#1A9089] hover:-translate-y-1 transition-all duration-200"
          >
            Ir al Catálogo de Insumos
          </Link>
        </div>
      </div>
    </main>
  )
}
