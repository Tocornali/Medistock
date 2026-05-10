import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const role = (req.auth?.user as any)?.role

  const isStaffRole = ['ADMIN', 'FINANCE', 'LOGISTICS', 'SALES'].includes(role)
  const isClientRole = ['USER', 'COMPANY'].includes(role)

  // 1. Proteger rutas de dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/staff', req.nextUrl))
    }
    
    if (isClientRole) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN' && role !== 'FINANCE') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    if (pathname.startsWith('/dashboard/inventory') && role !== 'LOGISTICS' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  // 2. Proteger /staff (Intranet)
  if (pathname.startsWith('/staff')) {
    if (isLoggedIn && isClientRole) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  // 3. Proteger /login (Portal Clientes)
  if (pathname.startsWith('/login')) {
    if (isLoggedIn && isStaffRole) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
