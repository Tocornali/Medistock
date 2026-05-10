import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CartIndicator from '@/components/CartIndicator'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { auth } from '@/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MEDISTOCK - Inicio',
  description: 'Sistema integral de catálogo y gestión médica',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="es">
      <body className={`${inter.className} bg-brand-light text-brand-dark dark:bg-brand-dark dark:text-brand-light transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {session?.user && <CartIndicator />}
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
