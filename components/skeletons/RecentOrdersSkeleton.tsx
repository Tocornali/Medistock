import React from 'react'

export default function RecentOrdersSkeleton() {
  const skeletons = Array.from({ length: 5 })

  return (
    <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-white/5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Órdenes Recientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/5 transition-colors">
            <tr>
              <th className="px-6 py-4">ID Orden</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {skeletons.map((_, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-32"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full animate-pulse w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-24"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
