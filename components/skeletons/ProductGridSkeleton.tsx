import React from 'react'

export default function ProductGridSkeleton() {
  const skeletons = Array.from({ length: 6 })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {skeletons.map((_, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-[#242729] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-[400px]"
        >
          {/* Imagen del producto: Bloque turquesa suave */}
          <div className="h-48 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full"></div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-4 flex-1 space-y-3">
              {/* Título: Dos líneas finas */}
              <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-1/2"></div>
              
              {/* SKU / Descripción corta */}
              <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-full mt-4"></div>
            </div>

            {/* Precio: Bloque mediano */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 mt-auto">
              <div className="h-8 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-1/3 mb-4"></div>
            </div>

            {/* Botón de compra: Rectángulo inferior */}
            <div className="mt-2">
              <div className="h-12 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-xl animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
