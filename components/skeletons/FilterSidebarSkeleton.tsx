import React from 'react'

export default function FilterSidebarSkeleton() {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
      <div className="bg-white dark:bg-[#242729] rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded"></div>
          <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-12 rounded"></div>
        </div>

        <div className="space-y-10">
          {/* Categorías */}
          <section>
            <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-20 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse rounded-lg"></div>
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-32 rounded"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Rango de Precio */}
          <section>
            <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-32 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-8 rounded"></div>
                  <div className="h-10 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-lg"></div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-8 rounded"></div>
                  <div className="h-10 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-lg"></div>
                </div>
              </div>
              <div className="h-1.5 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-lg"></div>
            </div>
          </section>

          {/* Stock */}
          <section>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded"></div>
              <div className="w-10 h-6 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse rounded-full"></div>
            </div>
          </section>

          {/* Tipo de Venta */}
          <section>
            <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse rounded-full"></div>
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-40 rounded"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Botón Aplicar */}
          <div className="h-12 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-2xl"></div>
        </div>
      </div>
    </aside>
  )
}
