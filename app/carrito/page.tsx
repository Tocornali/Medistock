'use client'

import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrencyCLP } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export default function CarritoPage() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors py-12 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Calculamos el total dinámicamente
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  const handleFinalizar = () => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout')
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors tracking-tight">Tu Carrito de Compras</h1>
          <Link href="/catalogo" className="text-brand-primary font-medium hover:text-blue-800 transition-colors">
            &larr; Seguir comprando
          </Link>
        </header>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#242729] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-16 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-slate-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-2xl font-medium text-slate-700 dark:text-slate-300 transition-colors mb-8">Tu carrito está completamente vacío</p>
            <Link href="/catalogo" className="inline-block bg-brand-primary hover:bg-[#1A9089] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md">
              Explorar el catálogo
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#242729] rounded-3xl border border-slate-200 dark:border-white/10 shadow-md overflow-hidden flex flex-col lg:flex-row">
            {/* Lista de productos */}
            <div className="flex-1 p-6 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Artículos Seleccionados ({items.length})</h2>
                <button
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Vaciar todo
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 last:border-0 last:pb-0 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors leading-tight mb-1">{item.nombre}</h3>
                      <p className="text-sm text-slate-500 font-medium">{formatCurrencyCLP(item.precio)} c/u</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                      {/* Controles de cantidad */}
                      <div className="flex items-center bg-slate-50 dark:bg-brand-dark transition-colors border border-slate-200 dark:border-white/10 rounded-lg h-10">
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-l-lg transition-colors font-medium"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-slate-800 dark:text-white transition-colors">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-r-lg transition-colors font-medium"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal por item */}
                      <div className="w-24 text-right">
                        <p className="font-black text-slate-800 dark:text-white transition-colors text-lg">
                          {formatCurrencyCLP(item.precio * item.cantidad)}
                        </p>
                      </div>

                      {/* Eliminar (ahora usamos un botón circular suave) */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Eliminar producto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen Sidebar */}
            <div className="w-full lg:w-[350px] bg-slate-50 dark:bg-brand-dark transition-colors p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors mb-8">Resumen</h2>

              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-white transition-colors text-lg">{formatCurrencyCLP(total)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-medium">Impuestos</span>
                <span className="font-bold text-slate-800 dark:text-white transition-colors text-lg">Calculado al final</span>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 mb-8 flex-1">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-800 dark:text-white transition-colors text-lg">Total</span>
                  <span className="text-4xl font-black text-brand-primary">{formatCurrencyCLP(total)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">Los envíos se cotizan posteriormente.</p>
              </div>

              <button
                onClick={handleFinalizar}
                className="w-full bg-brand-primary hover:bg-[#1A9089] text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-brand-primary/30 flex justify-center items-center gap-2 text-lg"
              >
                Finalizar Pedido
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
