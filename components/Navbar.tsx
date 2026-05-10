import Link from 'next/link'
import { auth } from '@/auth'
import LogoutButton from './LogoutButton'
import { ThemeToggle } from './ThemeToggle'
import CatalogLink from './CatalogLink'

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
    <nav className="fixed top-0 w-full bg-white dark:bg-brand-dark border-b border-slate-200 dark:border-white/10 z-40 shadow-sm h-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img 
            src="/images/Navlogo.png" 
            alt="MEDISTOCK Logo" 
            className="h-12 w-auto dark:hidden mix-blend-multiply" 
          />
          <img 
            src="/images/Navlogodark.png" 
            alt="MEDISTOCK Logo" 
            className="h-12 w-auto hidden dark:block" 
            style={{ filter: 'url(#remove-dark-bg)' }}
          />
        </Link>
        <div className="flex items-center space-x-6 pr-16"> {/* pr-16 deja espacio para el CartIndicator */}
          <CatalogLink />
          
          {session?.user ? (
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200 dark:border-white/10">
              <ThemeToggle />
              <Link 
                href={profileUrl}
                className="text-sm text-slate-700 dark:text-slate-300 font-medium hover:text-brand-primary transition-colors cursor-pointer"
                title="Ir a mi panel"
              >
                {session.user.name || session.user.email || 'Mi Cuenta'}
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="border-l pl-6 border-slate-200 dark:border-white/10 flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login" className="text-sm font-medium bg-brand-primary text-white px-5 py-2 rounded-md hover:bg-[#1A9089] transition-colors shadow-sm cursor-pointer">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
