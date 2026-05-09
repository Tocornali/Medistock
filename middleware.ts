import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const role = (req.auth?.user as any)?.role

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    if (role !== 'ADMIN' && role !== 'FINANCE') {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  // Proteger rutas de dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    
    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN' && role !== 'FINANCE') {
      return NextResponse.redirect(new URL('/dashboard/inventory', req.nextUrl))
    }

    if (pathname.startsWith('/dashboard/inventory') && role !== 'LOGISTICS' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
