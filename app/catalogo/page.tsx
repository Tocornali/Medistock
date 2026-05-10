import { PrismaClient } from '@prisma/client'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'
import { formatCurrencyCLP } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'

// Nota: En producción es mejor instanciar PrismaClient en un archivo global (singleton)
// para evitar múltiples conexiones en desarrollo. Para este MVP, esto funcionará perfecto.
const prisma = new PrismaClient()

export default async function CatalogoPage() {
  // Al ser un Server Component, esta consulta a base de datos se ejecuta
  // en el servidor durante el renderizado inicial, garantizando carga instantánea.
  const products = await prisma.product.findMany({
    orderBy: {
      nombre: 'asc', // Ordenados alfabéticamente
    },
  })
  
  const session = await auth()
  const user = session?.user as any

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            Distribuidora MEDISTOCK
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium transition-colors">
            Catálogo de Insumos
          </p>
          <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full mt-6"></div>
        </header>

        {/* Cuadrícula de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const finalPrice = calculatePrice(product, user)
            const isCompany = user?.role === 'COMPANY'

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#242729] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                {/* Nombre y SKU */}
                <div className="mb-4 flex-1">
                  <Link href={`/catalogo/${product.id}`} className="hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-2 line-clamp-2 hover:text-brand-primary">
                      {product.nombre}
                    </h3>
                  </Link>
                  <span className="inline-block bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono text-xs px-2 py-1 rounded-md transition-colors">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Precio y Stock */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-end justify-between mt-auto transition-colors">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Precio</p>
                    <div className="flex flex-col">
                      <p className="text-2xl font-black text-[#1A9089] dark:text-brand-primary">
                        {formatCurrencyCLP(finalPrice)}
                      </p>
                      {isCompany && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 self-start">
                          Precio Mayorista
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">Stock Global</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold transition-colors ${product.stock_global > 20
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}
                    >
                      {product.stock_global} und.
                    </span>
                  </div>
                </div>

                {/* Botón de añadir al carrito */}
                <AddToCartButton product={{ id: product.id, nombre: product.nombre, precio: finalPrice, stock_global: product.stock_global }} />
              </div>
            </div>
            )
          })}

          {/* Estado vacío en caso de que no haya productos */}
          {products.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white dark:bg-[#242729] rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 transition-colors">
              <p className="text-slate-500 dark:text-slate-400 text-lg">No hay productos en el catálogo en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
