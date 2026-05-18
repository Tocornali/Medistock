"use client"

import { Building2, Code2, Heart, Pill, Truck, User } from "lucide-react"

const TRUST_ITEMS = [
  { icon: User, label: "Profesionales Independientes" },
  { icon: Building2, label: "Clínicas y Hospitales" },
  { icon: Code2, label: "Integradores de Software" },
  { icon: Heart, label: "Pacientes y Cuidadores" },
  { icon: Pill, label: "Farmacias Asociadas" },
  { icon: Truck, label: "Proveedores Logísticos" },
]

export default function TrustCarousel() {
  // Duplicamos los items para lograr el efecto infinito con el CSS translate(-50%)
  const carouselItems = [...TRUST_ITEMS, ...TRUST_ITEMS]

  return (
    <div className="w-full overflow-hidden relative mt-16 sm:mt-24 pb-8 opacity-80 hover:opacity-100 transition-opacity duration-500 max-w-7xl mx-auto">
      
      {/* Máscaras laterales adaptativas para modo claro y oscuro */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-brand-dark to-transparent z-10 pointer-events-none transition-colors" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-brand-dark to-transparent z-10 pointer-events-none transition-colors" />

      <div className="flex w-max animate-marquee">
        {carouselItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div 
              key={idx} 
              className="flex items-center gap-3 px-8 md:px-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:text-brand-primary transition-all duration-300 text-slate-600 dark:text-slate-400"
            >
              <Icon className="w-6 h-6 md:w-8 md:h-8" />
              <span className="font-bold tracking-widest whitespace-nowrap text-[10px] md:text-xs uppercase">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
