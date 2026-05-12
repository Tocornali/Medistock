import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"
import SidebarNav from "@/components/SidebarNav"
import SidebarFooter from "@/components/SidebarFooter"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const role = (session.user as any).role
  const isAdmin = role === 'ADMIN' || role === 'FINANCE' || role === 'LOGISTICS' || role === 'SALES'

  return (
    <div className="flex h-[calc(100vh-64px)] bg-brand-light dark:bg-brand-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1A1C1E] text-slate-300 flex flex-col border-r border-slate-800/50">
        {/* Header del Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {isAdmin ? 'Medistock Intranet' : 'Mi Cuenta'}
            </span>
          </div>
        </div>

        {/* Navegación Principal */}
        <SidebarNav role={role} />
        
        {/* Footer del Sidebar (Client Component) */}
        <SidebarFooter user={{ name: session.user.name, role }} />
      </aside>

      {/* Area de Contenido */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
