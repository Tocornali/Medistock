"use client"

import { useTransition, useState } from "react"
import { signOut } from "next-auth/react"
import { useCartStore } from "@/store/useCartStore"
import { Loader2 } from "lucide-react"

export default function LogoutButton() {
  const clearCart = useCartStore(state => state.clearCart)
  const [isPending, startTransition] = useTransition()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    startTransition(async () => {
      // 1. Limpiamos el carrito (estado global del cliente)
      clearCart()
      // 2. Cerramos la sesión
      await signOut({ callbackUrl: "/login" })
    })
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut || isPending}
      className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 hover:shadow-none focus:outline-none"
    >
      {(isLoggingOut || isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
      {isLoggingOut || isPending ? "Cerrando sesión..." : "Cerrar Sesión"}
    </button>
  )
}
