"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductCarouselClient({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -360, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 360, behavior: "smooth" })
    }
  }

  return (
    <div className="relative group/carousel">
      {/* Botón Izquierda */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary hover:scale-110 transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Contenedor del Carrusel */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory custom-scrollbar scroll-smooth"
      >
        {children}
      </div>

      {/* Botón Derecha */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary hover:scale-110 transition-all cursor-pointer opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
