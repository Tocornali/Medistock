import Link from 'next/link'
import { auth } from '@/auth'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const session = await auth()
  
  let profileUrl = '/mis-ordenes';
  if (session?.user) {
    const role = (session.user as any).role;
    if (role === 'ADMIN' || role === 'FINANCE') {
      profileUrl = '/dashboard/admin';
    } else if (role === 'LOGISTICS') {
      profileUrl = '/dashboard/inventory';
    } else if (role === 'SALES') {
      profileUrl = '/dashboard/orders';
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-slate-200 z-40 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          MEDISTOCK
        </Link>
        <div className="flex items-center space-x-6 pr-16"> {/* pr-16 deja espacio para el CartIndicator */}
          <Link href="/catalogo" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
            Catálogo
          </Link>
          
          {session?.user ? (
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <Link 
                href={profileUrl}
                className="text-sm text-slate-700 font-medium hover:text-blue-600 transition-colors"
                title="Ir a mi panel"
              >
                {session.user.name || session.user.email || 'Mi Cuenta'}
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="border-l pl-6 border-slate-200">
              <Link href="/login" className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
