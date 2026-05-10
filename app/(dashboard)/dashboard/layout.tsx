import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut 
} from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const role = (session.user as any).role

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-tight">Medistock Admin</span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {(role === 'ADMIN' || role === 'FINANCE') && (
            <Link 
              href="/dashboard/admin" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Resumen
            </Link>
          )}

          <Link 
            href="/dashboard/inventory" 
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Package className="w-5 h-5" />
            Gestión de Inventario
          </Link>

          {(role === 'ADMIN' || role === 'SALES' || role === 'FINANCE') && (
            <Link 
              href="/dashboard/orders" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Órdenes y Ventas
            </Link>
          )}

          {role === 'ADMIN' && (
            <Link 
              href="/dashboard/admin/empleados" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Users className="w-5 h-5" />
              Gestión de Empleados
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {session.user.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">{role}</p>
            </div>
          </div>
          <Link 
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-slate-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
