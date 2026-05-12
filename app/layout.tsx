import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CartIndicator from '@/components/CartIndicator'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MEDISTOCK | Insumos Médicos Profesionales',
  description: 'Sistema integral de catálogo y gestión médica de alta calidad',
  icons: {
    icon: '/images/Favicon.png',
  },
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="es" suppressHydrationWarning data-theme-loading>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `[data-theme-loading] body { opacity: 0; }` }} />
      </head>
      <body className={`${inter.className} bg-brand-light text-brand-dark dark:bg-brand-dark dark:text-brand-light transition-colors duration-300`}>
        {/* Filtro para eliminar fondos oscuros de logos no transparentes */}
        <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none', visibility: 'hidden' }} aria-hidden="true">
          <filter id="remove-dark-bg" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              1 1 1 0 -1
            " />
          </filter>
        </svg>
        <SessionProvider session={session}>
          <ThemeProvider defaultTheme="system">
            <Navbar />
            <CartIndicator />
            <main className="pt-16">
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
