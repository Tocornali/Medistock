import React from 'react'

export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark/20 p-4 lg:p-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Columna Izquierda: Pedido */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="h-10 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-48 rounded-lg"></div>
                <div className="h-8 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded-lg"></div>
              </div>

              {/* Items del carrito */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-6 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <div className="space-y-2">
                    <div className="h-6 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-64 rounded"></div>
                    <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-32 rounded"></div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="h-12 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-32 rounded-2xl"></div>
                    <div className="h-8 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded"></div>
                    <div className="h-6 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-6 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Opciones de entrega */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl p-10">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-32 rounded mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-16 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-2xl"></div>
                    <div className="h-16 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl p-10 space-y-8 sticky top-12">
              <div className="h-8 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-32 rounded-lg"></div>
              
              <div className="space-y-4">
                <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded"></div>
                <div className="h-2.5 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-full"></div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-20 rounded"></div>
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-20 rounded"></div>
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded"></div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-white/5 space-y-2">
                <div className="flex justify-between items-end">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-16 rounded"></div>
                  <div className="h-12 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-40 rounded-lg"></div>
                </div>
                <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded ml-auto"></div>
              </div>

              <div className="h-16 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-2xl mt-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
