"use client"

import { useRouter, useSearchParams } from 'next/navigation'

export default function DashboardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('periodo') || '30d'

  const handleFilterChange = (periodo: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('periodo', periodo)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/10 p-1">
      <button 
        onClick={() => handleFilterChange('7d')}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentFilter === '7d' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
      >
        7 Días
      </button>
      <button 
        onClick={() => handleFilterChange('30d')}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentFilter === '30d' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
      >
        Este Mes
      </button>
      <button 
        onClick={() => handleFilterChange('1y')}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentFilter === '1y' ? 'bg-brand-primary text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
      >
        Año Actual
      </button>
    </div>
  )
}
