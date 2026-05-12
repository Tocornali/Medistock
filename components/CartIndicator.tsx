'use client'

import { useCartStore } from '@/store/useCartStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CartIndicator() {
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const pathname = usePathname()
  
  // Seleccionamos la propiedad 'items' para que Zustand reactive el componente a sus cambios
  const items = useCartStore(state => state.items)
  
  // Resolvemos el error de hidratación renderizando el indicador solo cuando el componente se ha montado en el cliente.
  useEffect(() => {
    setMounted(true)
  }, [])

  const isHiddenPath = pathname?.startsWith('/dashboard') || pathname?.startsWith('/staff')
  
  // Calculamos el totalItems dinámicamente basado en los items
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0)

  // Feedback visual animado en el carrito
  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  if (!mounted || isHiddenPath) return null

  return (
    <div className="fixed top-2 right-4 z-50">
      <Link 
        href="/carrito" 
        className={`relative bg-white/80 dark:bg-brand-dark/80 backdrop-blur-xl p-3 rounded-full shadow-lg border border-brand-primary/30 flex items-center justify-center cursor-pointer hover:shadow-brand-primary/20 hover:border-brand-primary transition-all duration-300 block ${isAnimating ? 'scale-125' : 'scale-100'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-brand-dark transition-colors">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </Link>
    </div>
  )
}
