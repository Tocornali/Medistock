"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LoginButton() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <Link 
      href="/login" 
      className="text-sm font-medium bg-brand-primary text-white px-5 py-2 rounded-md hover:bg-[#1A9089] transition-colors shadow-sm cursor-pointer"
    >
      Iniciar Sesión
    </Link>
  )
}
