"use client"

import { signOut } from "next-auth/react"
import { useCartStore } from "@/store/useCartStore"

export default function LogoutButton() {
  const clearCart = useCartStore(state => state.clearCart)

  const handleLogout = async () => {
    // 1. Limpiamos el carrito (estado global del cliente)
    clearCart()
    // 2. Cerramos la sesión
    await signOut({ callbackUrl: "/" })
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
    >
      Cerrar Sesión
    </button>
  )
}
