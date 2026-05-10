'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface CatalogFiltersProps {
  categories: string[]
}

export default function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(true)

  const currentCategory = searchParams.get('category') || ''
  const currentAvailability = searchParams.get('available') || ''
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6">
      <div className="bg-white dark:bg-[#242729] rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-primary" />
            Filtros
          </h3>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-500 hover:text-brand-primary transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`space-y-8 ${isOpen ? 'block' : 'hidden lg:block'}`}>
          {/* Categorías */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Categoría
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => updateFilters('category', '')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  currentCategory === ''
                    ? 'bg-brand-primary/10 text-brand-primary font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                Todas las categorías
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilters('category', cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    currentCategory === cat
                      ? 'bg-brand-primary/10 text-brand-primary font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Rango de Precio
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={currentMinPrice}
                onBlur={(e) => updateFilters('minPrice', e.target.value)}
                className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors"
              />
              <input
                type="number"
                placeholder="Max"
                defaultValue={currentMaxPrice}
                onBlur={(e) => updateFilters('maxPrice', e.target.value)}
                className="w-full bg-slate-50 dark:bg-brand-dark/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Disponibilidad
            </h4>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentAvailability === 'true'}
                onChange={(e) => updateFilters('available', e.target.checked ? 'true' : '')}
                className="w-5 h-5 rounded border-slate-300 dark:border-white/20 text-brand-primary focus:ring-brand-primary/50 bg-transparent"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-brand-primary transition-colors">
                Solo con stock
              </span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  )
}
