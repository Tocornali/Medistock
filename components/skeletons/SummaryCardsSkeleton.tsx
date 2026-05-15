import React from 'react'

export default function SummaryCardsSkeleton() {
  const skeletons = Array.from({ length: 4 })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletons.map((_, index) => (
        <div key={index} className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-24"></div>
            <div className="h-6 bg-brand-primary/10 dark:bg-brand-primary/5 rounded animate-pulse w-16"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
