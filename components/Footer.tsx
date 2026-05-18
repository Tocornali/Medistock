import Link from 'next/link'
import { Box } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-slate-200/60 dark:bg-slate-900/50 border-t border-slate-300 dark:border-white/5 py-16 px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Columna 1: Marca y Slogan */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Box className="w-6 h-6 text-brand-primary" />
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                Medistock<span className="text-brand-primary">.</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs transition-colors">
              E-commerce de insumos médicos y logística avanzada para profesionales, instituciones y desarrolladores.
            </p>
          </div>

          {/* Columna 2: Enlaces del Portal */}
          <div className="flex flex-col">
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 tracking-wide transition-colors">Plataforma</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/catalogo" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                Tienda Minorista (B2C)
              </Link>
              <Link href="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/mis-ordenes" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                Seguimiento de Órdenes
              </Link>
            </nav>
          </div>

          {/* Columna 3: Accesos Legales y Técnicos */}
          <div className="flex flex-col">
            <h4 className="text-slate-900 dark:text-white font-bold mb-4 tracking-wide transition-colors">Desarrollo y Legal</h4>
            <nav className="flex flex-col gap-3">
              <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                Documentación API REST
              </Link>
              <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/staff" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mt-2">
                Acceso Empleados (Staff)
              </Link>
            </nav>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-300 dark:border-white/5 flex items-center justify-center text-center transition-colors">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Medistock SpA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
