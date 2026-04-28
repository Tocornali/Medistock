import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CartIndicator from '@/components/CartIndicator'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MEDISTOCK - Inicio',
  description: 'Sistema integral de catálogo y gestión médica',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <CartIndicator />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
