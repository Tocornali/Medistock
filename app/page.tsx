import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import TrustCarousel from '@/components/TrustCarousel'
import FeaturesGrid from '@/components/FeaturesGrid'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-brand-dark overflow-hidden selection:bg-brand-primary/30 transition-colors">
        {/* Fondo corporativo adaptativo */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-brand-dark z-0 transition-colors" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent z-0" />

        {/* Contenido Central */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          
          {/* Etiqueta de confianza B2B */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/80 dark:bg-black/20 border border-brand-primary/30 dark:border-brand-primary/20 text-slate-700 dark:text-slate-300 text-sm font-medium mb-8 shadow-sm transition-colors">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span>Plataforma B2C, B2B & Developer API</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1] transition-colors">
            El E-Commerce de <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-400 dark:to-teal-300">
              Insumos Médicos
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light transition-colors">
            La plataforma definitiva para profesionales, clínicas y desarrolladores. Compra directa, gestión de órdenes institucionales y una API robusta para integrar nuestro catálogo en tu propio negocio.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href="/catalogo"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-brand-primary/20"
            >
              Explorar Tienda
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login"
              className="flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-300 dark:border-slate-700 hover:border-brand-primary dark:hover:border-brand-primary/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg font-medium transition-all duration-300"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Carrusel de Confianza */}
          <TrustCarousel />
        </main>
      </div>

      {/* Grid de Características / Arquitectura */}
      <FeaturesGrid />

      {/* Footer */}
      <Footer />
    </>
  )
}
