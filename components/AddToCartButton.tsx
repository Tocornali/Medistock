'use client'

import { useCartStore } from '@/store/useCartStore'
import { useState } from 'react'

interface AddToCartButtonProps {
  product: {
    id: string
    nombre: string
    precio: number
    stock_global: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore(state => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({ ...product, cantidad: 1 })
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 1000) // Feedback visual durante 1 segundo
  }

  const isOutOfStock = product.stock_global <= 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`mt-4 w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
        isOutOfStock 
          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
          : isAdded 
            ? 'bg-emerald-600 hover:bg-emerald-700' 
            : 'bg-brand-primary hover:bg-[#1A9089] hover:shadow-brand-primary/30'
      }`}
    >
      {isOutOfStock ? (
        'Agotado'
      ) : isAdded ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          ¡Añadido!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          Añadir al carrito
        </>
      )}
    </button>
  )
}
