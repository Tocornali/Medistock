import Link from 'next/link'
import { auth } from '@/auth'
import LogoutButton from './LogoutButton'
import { ThemeToggle } from './ThemeToggle'
import CatalogLink from './CatalogLink'
import LoginButton from './LoginButton'

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
                href="/configuracion"
                className="text-slate-400 hover:text-brand-primary transition-colors"
                title="Configuración de cuenta"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
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
              <LoginButton />
              <Link href="/staff" className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Empleados
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
