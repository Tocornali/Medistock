'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  disabled?: boolean
  error?: boolean
  label?: string
}

export default function CustomSelect({ options, value, onChange, placeholder, disabled, error, label }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      // Si hay menos de 300px abajo y más espacio arriba, abrir hacia arriba
      setOpenUp(spaceBelow < 300 && spaceAbove > spaceBelow)
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
      
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full bg-slate-50 dark:bg-[#2A2D2F] border ${error ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-4 outline-none focus:border-brand-primary transition-all font-bold text-left flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className={value ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-[100] w-full ${openUp ? 'bottom-full mb-2' : 'mt-2'} bg-white dark:bg-[#242729] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in ${openUp ? 'slide-in-from-bottom-2' : 'zoom-in-95'} duration-200 backdrop-blur-xl`}>
          <div className="max-h-64 overflow-y-auto my-4 mr-3 ml-1 p-2 custom-scrollbar">
            {options.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-400 text-sm font-medium">
                No hay opciones disponibles
              </div>
            )}
            <div className="space-y-1 pr-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-6 py-4 text-sm font-black flex justify-between items-center transition-all rounded-2xl ${
                    value === opt 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {opt}
                  {value === opt && <Check className="w-4 h-4 stroke-[3px]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
