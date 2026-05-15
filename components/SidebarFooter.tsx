"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut, Settings, Loader2 } from "lucide-react"

interface SidebarFooterProps {
  user: {
    name?: string | null
    role: string
  }
}

export default function SidebarFooter({ user }: SidebarFooterProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    startTransition(async () => {
      await signOut({ callbackUrl: "/login" })
    })
  }

  return (
    <div className="p-4 border-t border-white/5 space-y-2 bg-black/10">
      {/* Perfil Mini */}
      <div className="flex items-center gap-3 mb-4 px-2 py-1">
        <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold shrink-0">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Rol: {user.role}</p>
        </div>
      </div>

      {/* Enlaces de Acción */}
      <div className="space-y-1">
        <Link
          href="/configuracion"
          className={`flex items-center gap-3 px-3 py-2 w-full text-left rounded-md transition-all duration-200 group hover:bg-brand-primary/10 hover:text-brand-primary ${
            pathname === '/configuracion' 
              ? 'text-brand-primary font-semibold' 
              : 'text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Configuración</span>
        </Link>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut || isPending}
          className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut || isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-red-400" />
          ) : (
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
          <span className="text-sm font-medium">
            {isLoggingOut || isPending ? "Cerrando sesión..." : "Cerrar Sesión"}
          </span>
        </button>
      </div>
    </div>
  )
}
