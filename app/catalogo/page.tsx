import { PrismaClient, Prisma } from '@prisma/client'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'
import { formatCurrencyCLP } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'
import SearchBar from '@/components/SearchBar'
import CatalogFilters from '@/components/CatalogFilters'
import { Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'

const prisma = new PrismaClient()

interface PageProps {
  searchParams: Promise<{ 
    q?: string
    category?: string
    available?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ''
  const category = resolvedSearchParams.category || ''
  const onlyAvailable = resolvedSearchParams.available === 'true'
  const minPrice = parseFloat(resolvedSearchParams.minPrice || '0')
  const maxPrice = parseFloat(resolvedSearchParams.maxPrice || '999999999')

  // Construir filtros de Prisma
  const where: Prisma.ProductWhereInput = {
    AND: [
      query ? {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } },
        ]
      } : {},
      category ? { category } : {},
      onlyAvailable ? { stock_global: { gt: 0 } } : {},
      { precio: { gte: minPrice, lte: maxPrice } }
    ]
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: {
      nombre: 'asc',
    },
  })

  // Obtener categorías únicas para los filtros
  const uniqueCategories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  }).then(res => res.map(r => r.category).filter(Boolean) as string[])
  
  const session = await auth()
  const user = session?.user as any

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-brand-dark/20 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            Distribuidora <span className="text-brand-primary">MEDISTOCK</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
            Suministros Médicos de Grado Profesional
          </p>
          <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full mt-6"></div>
        </header>

        {/* Barra de Búsqueda */}
        <SearchBar />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <CatalogFilters categories={uniqueCategories} />

          {/* Cuadrícula de Productos */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const finalPrice = calculatePrice(product, user)
                const isCompany = user?.role === 'COMPANY'
                
                // Lógica de badges de stock
                let stockBadge = {
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  text: 'En Stock',
                  className: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
                  stock: product.stock_global
                }

                if (product.stock_global === 0) {
                  stockBadge = {
                    icon: <XCircle className="w-4 h-4" />,
                    text: 'Sin Stock',
                    className: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
                    stock: 0
                  }
                } else if (product.stock_global < 20) {
                  stockBadge = {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    text: 'Stock Bajo',
                    className: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
                    stock: product.stock_global
                  }
                }

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-[#242729] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col group"
                  >
                    {/* Placeholder para imagen con categoría */}
                    <div className="h-48 bg-slate-100 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
                      <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                          {product.category || 'Insumo'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 flex-1">
                        <Link href={`/productos/${product.id}`} className="block group/link">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2 line-clamp-2 group-hover/link:text-brand-primary transition-colors">
                            {product.nombre}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                          {product.descripcion || 'Sin descripción disponible.'}
                        </p>
                        <span className="inline-block bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono text-[10px] px-2 py-1 rounded-md transition-colors">
                          SKU: {product.sku}
                        </span>
                      </div>

                      {/* Precio y Stock */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <p className="text-2xl font-black text-[#1A9089] dark:text-brand-primary tracking-tighter">
                            {formatCurrencyCLP(finalPrice)}
                          </p>
                          {isCompany && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Precio Empresa Aplicado
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${stockBadge.className}`}>
                            {stockBadge.icon}
                            {stockBadge.text}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{stockBadge.stock} unidades</span>
                        </div>
                      </div>

                      {/* Botón de añadir al carrito */}
                      <div className="mt-6">
                        <AddToCartButton 
                          product={{ 
                            id: product.id, 
                            nombre: product.nombre, 
                            precio: finalPrice, 
                            stock_global: product.stock_global 
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Estado vacío */}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white dark:bg-[#242729] rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 transition-colors">
                  <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No encontramos resultados</h3>
                  <p className="text-slate-500 dark:text-slate-400">Intenta ajustar tus filtros o buscar con otros términos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
