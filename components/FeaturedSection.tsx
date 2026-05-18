import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { formatCurrencyCLP } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'
import { Package, ArrowRight, Tag, Sparkles, Layers, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'

const prisma = new PrismaClient()

export default async function FeaturedSection() {
  const session = await auth()
  const user = session?.user as any
  const isCompany = user?.role === 'COMPANY'

  // 1. Obtener Categorías
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { name: 'asc' }
  })

  // 2. Obtener Productos Elegidos para Ti (3 productos)
  const chosenProducts = await prisma.product.findMany({
    where: {
      variants: {
        some: { stock: { gt: 0 } }
      }
    },
    include: {
      variants: true,
      category: true
    },
    take: 3,
    orderBy: {
      name: 'asc'
    }
  })

  if (chosenProducts.length === 0 && categories.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-white dark:bg-[#242729] py-12 px-8 border border-slate-200 dark:border-white/10 transition-colors mb-12 rounded-3xl shadow-sm">
      <div className="space-y-16">
        
        {/* ENCABEZADO DE SECCIÓN */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Selección Premium</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              Explora Nuestro Catálogo
            </h2>
          </div>
        </div>

        {/* 1. SECCIÓN: ELEGIDOS PARA TI (GRID) */}
        {chosenProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-primary" />
              Elegidos para Ti
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {chosenProducts.map((product) => (
                <ProductCardItem key={product.id} product={product} user={user} isCompany={isCompany} />
              ))}
            </div>
          </div>
        )}

        {/* 2. SECCIÓN: ACCESOS RÁPIDOS POR CATEGORÍA */}
        {categories.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-primary" />
              Explorar por Categoría
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogo?category=${encodeURIComponent(cat.name)}`}
                  className="group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-brand-primary dark:hover:border-brand-primary/50 hover:bg-slate-50/80 dark:hover:bg-white/[0.07] transition-all duration-300 flex items-center justify-between shadow-sm dark:shadow-none"
                >
                  <span className="font-bold text-slate-800 dark:text-white group-hover:text-brand-primary transition-colors truncate pr-2">
                    {cat.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 flex-shrink-0 shadow-sm">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

/* COMPONENTE INTERNO PARA RENDERIZAR LA TARJETA DE PRODUCTO */
function ProductCardItem({ product, user, isCompany }: { product: any, user: any, isCompany: boolean }) {
  const baseVariant = product.variants[0];
  if (!baseVariant) return null;

  const finalPrice = calculatePrice(baseVariant, user);
  const totalStock = product.variants.reduce((acc: any, v: any) => acc + v.stock, 0);
  
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
    <div className="w-full bg-white dark:bg-[#2B2F31] rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col group relative">
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
        
        <div className="absolute top-4 left-4 pointer-events-none flex gap-2">
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
}
