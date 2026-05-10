import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LogOut } from "lucide-react"
import SidebarNav from "@/components/SidebarNav"

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
    <div className="flex h-[calc(100vh-64px)] bg-brand-light dark:bg-brand-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-slate-300 flex flex-col border-r border-slate-800/50">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-xl font-bold text-white tracking-tight">Medistock Admin</span>
        </div>

        <SidebarNav role={role} />
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
              {session.user.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">{role}</p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-brand-light dark:bg-brand-dark transition-colors duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
