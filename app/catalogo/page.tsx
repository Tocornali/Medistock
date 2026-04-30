import { PrismaClient } from '@prisma/client'
import AddToCartButton from '@/components/AddToCartButton'
import Link from 'next/link'
import { formatCurrencyCLP } from '@/lib/utils'

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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Distribuidora MEDISTOCK
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Catálogo de Insumos
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-6"></div>
        </header>

        {/* Cuadrícula de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                {/* Nombre y SKU */}
                <div className="mb-4 flex-1">
                  <Link href={`/catalogo/${product.id}`} className="hover:text-blue-600 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2 hover:text-blue-600">
                      {product.nombre}
                    </h3>
                  </Link>
                  <span className="inline-block bg-slate-100 text-slate-500 font-mono text-xs px-2 py-1 rounded-md">
                    SKU: {product.sku}
                  </span>
                </div>

                {/* Precio y Stock */}
                <div className="pt-4 border-t border-slate-100 flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Precio</p>
                    <p className="text-2xl font-black text-blue-700">
                      {formatCurrencyCLP(product.precio)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Stock Global</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${product.stock_global > 20
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                        }`}
                    >
                      {product.stock_global} und.
                    </span>
                  </div>
                </div>

                {/* Botón de añadir al carrito */}
                <AddToCartButton product={{ id: product.id, nombre: product.nombre, precio: product.precio, stock_global: product.stock_global }} />
              </div>
            </div>
          ))}

          {/* Estado vacío en caso de que no haya productos */}
          {products.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <p className="text-slate-500 text-lg">No hay productos en el catálogo en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
