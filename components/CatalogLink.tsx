'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CatalogLink() {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/staff')) {
    return null
  }

  return (
    <Link href="/catalogo" className="text-slate-600 dark:text-slate-300 hover:text-brand-primary font-medium transition-colors">
      Catálogo
    </Link>
  )
}
