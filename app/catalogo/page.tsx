import { PrismaClient } from '@prisma/client'
import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar'
import FilterSidebar from '@/components/FilterSidebar'
import ProductList from '@/components/ProductList'
import ProductGridSkeleton from '@/components/skeletons/ProductGridSkeleton'
import FeaturedSection from '@/components/FeaturedSection'
import { auth } from '@/auth'

const prisma = new PrismaClient()

interface PageProps {
  searchParams: Promise<{ 
    q?: string
    category?: string
    brand?: string
    inStock?: string
    prescription?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export const dynamic = "force-dynamic";

export default async function CatalogoPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  
  const session = await auth()
  const user = session?.user as any
  const isCompany = user?.role === 'COMPANY'

  // 3. Obtener Datos para el Sidebar (Categorías)
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: 'asc' }
  })
  const categoryNames = categories.map(c => c.name)

  // Creamos un string único basado en los filtros para forzar el re-render de Suspense
  const suspenseKey = JSON.stringify(resolvedSearchParams)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-brand-dark/20 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            Distribuidora <span className="text-brand-primary">MEDISTOCK</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
              Suministros Médicos de Grado Profesional
            </p>
            {isCompany ? (
              <span className="px-4 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                Tarifa Corporativa Activada
              </span>
            ) : (
              <span className="px-4 py-1 bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest">
                Tarifa Venta Público
              </span>
            )}
          </div>
          <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full mt-6"></div>
        </header>

        {/* Barra de Búsqueda */}
        <SearchBar />

        {/* Sección Destacada (Visible solo cuando no hay filtros de búsqueda o categoría activos) */}
        {!resolvedSearchParams.q && !resolvedSearchParams.category && (
          <FeaturedSection />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros Avanzados */}
          <FilterSidebar categories={categoryNames} />

          {/* Cuadrícula de Productos con Suspense para filtros asíncronos */}
          <div className="flex-1">
            <Suspense key={suspenseKey} fallback={<ProductGridSkeleton />}>
              <ProductList searchParams={resolvedSearchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

