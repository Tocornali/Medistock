import { PrismaClient, Prisma } from '@prisma/client'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'
import { formatCurrencyCLP } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'
import { Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'

const prisma = new PrismaClient()

interface ProductListProps {
  searchParams: { 
    q?: string
    category?: string
    brand?: string
    inStock?: string
    prescription?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function ProductList({ searchParams }: ProductListProps) {
  const query = searchParams.q || ''
  
  const selectedCategories = searchParams.category?.split(',') || []
  const inStockOnly = searchParams.inStock === 'true'
  const prescription = searchParams.prescription || 'all'
  const minPrice = parseFloat(searchParams.minPrice || '0')
  const maxPrice = parseFloat(searchParams.maxPrice || '999999999')

  const session = await auth()
  const user = session?.user as any
  const isCompany = user?.role === 'COMPANY'

  const whereClause: Prisma.ProductWhereInput = {
    AND: [
      query ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ]
      } : {},
      selectedCategories.length > 0 ? {
        category: { name: { in: selectedCategories } }
      } : {},
      prescription === 'prescription' ? { requiereReceta: true } : 
      prescription === 'free' ? { requiereReceta: false } : {},
      !isCompany ? { isInstitutionalOnly: false } : {},
      {
        variants: {
          some: isCompany 
            ? { companyPrice: { gte: minPrice, lte: maxPrice } }
            : { price: { gte: minPrice, lte: maxPrice } }
        }
      },
      inStockOnly ? {
        variants: {
          some: {
            stock: { gt: 0 }
          }
        }
      } : {}
    ]
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      variants: true,
      category: true
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => {
        const baseVariant = product.variants[0];
        if (!baseVariant) return null;

        const finalPrice = calculatePrice(baseVariant, user);
        const retailPrice = baseVariant.price;
        const hasDiscount = isCompany && finalPrice < retailPrice;
        const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        
        let stockBadge = {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: 'En Stock',
          className: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
          stock: totalStock
        };

        if (totalStock === 0) {
          stockBadge = {
            icon: <XCircle className="w-4 h-4" />,
            text: 'Sin Stock',
            className: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
            stock: 0
          };
        } else if (totalStock < 20) {
          stockBadge = {
            icon: <AlertTriangle className="w-4 h-4" />,
            text: 'Stock Bajo',
            className: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
            stock: totalStock
          };
        }

        return (
          <div
            key={product.id}
            className="bg-white dark:bg-[#242729] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col group relative"
          >
            <div className="h-48 bg-slate-100 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
              <Link href={`/productos/${product.id}`} className="w-full h-full block group/img">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 group-hover/img:scale-110 transition-transform duration-500" />
                )}
              </Link>
              
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="px-3 py-1 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {product.category?.name || 'Insumo'}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4 flex-1">
                <Link href={`/productos/${product.id}`} className="block group/link cursor-pointer">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2 line-clamp-2 group-hover/link:text-brand-primary transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {product.description || 'Sin descripción disponible.'}
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <span className="inline-block bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono text-[10px] px-2 py-1 rounded-md transition-colors">
                  {product.variants.length} {product.variants.length > 1 ? 'Variantes' : 'Variante'}
                </span>
                {product.requiereReceta && !isCompany && (
                  <span className="inline-block bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[10px] px-2 py-1 rounded-md">
                    Receta
                  </span>
                )}
                {product.requiereReceta && isCompany && (
                  <span className="inline-block bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] px-2 py-1 rounded-md">
                    Resolución S.
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  {hasDiscount && (
                    <span className="text-[10px] text-slate-400 line-through decoration-red-400/50">
                      {formatCurrencyCLP(retailPrice)}
                    </span>
                  )}
                  <p className="text-2xl font-black text-[#1A9089] dark:text-brand-primary tracking-tighter">
                    {formatCurrencyCLP(finalPrice)}
                  </p>
                  {isCompany && (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter mt-0.5">
                      Tarifa Corporativa
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

              <div className="mt-6">
                <AddToCartButton 
                  product={{
                    id: baseVariant.id, 
                    productId: product.id,
                    nombre: product.name,
                    sku: baseVariant.sku,
                    variantName: baseVariant.nameModifier,
                    precio: isCompany ? baseVariant.companyPrice : baseVariant.price,
                    stock_global: baseVariant.stock,
                    requiereReceta: product.requiereReceta,
                    image: product.imageUrl || undefined
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}

      {products.length === 0 && (
        <div className="col-span-full min-h-[500px] flex flex-col items-center justify-center text-center bg-white dark:bg-[#242729] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 transition-all duration-500 shadow-inner">
          <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No encontramos resultados</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Intenta ajustar tus filtros o buscar con otros términos para encontrar lo que necesitas.
          </p>
        </div>
      )}
    </div>
  )
}
