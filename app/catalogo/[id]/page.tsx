import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import { formatCurrencyCLP } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'

const prisma = new PrismaClient()

// Next.js pasa las carpetas dinámicas a través de props.params
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  // 1. Buscamos el producto en base de datos
  const product = await prisma.product.findUnique({
    where: { id: id },
  })

  // 2. Si no existe, arrojamos un 404 (notFound)
  if (!product) {
    notFound()
  }

  const session = await auth()
  const user = session?.user as any
  const finalPrice = calculatePrice(product, user)
  const isCompany = user?.role === 'COMPANY'

  // 3. Renderizamos la vista de producto
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Navegación */}
        <nav className="mb-8 flex text-sm font-medium text-slate-500">
          <Link href="/catalogo" className="hover:text-blue-600 transition-colors">
            Catálogo
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{product.nombre}</span>
        </nav>

        {/* Contenedor Principal: 2 Columnas */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Izquierda: Imagen del producto */}
            <div className="bg-slate-100 flex flex-col items-center justify-center p-12 aspect-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-slate-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-slate-400 font-medium">Imagen del Insumo</span>
            </div>

            {/* Derecha: Detalles del producto */}
            <div className="p-8 md:p-12 flex flex-col">
              
              <div className="mb-2">
                <span className="inline-block bg-slate-100 text-slate-600 font-mono text-sm px-3 py-1 rounded-lg">
                  SKU: {product.sku}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                {product.nombre}
              </h1>

              <div className="mb-8 flex flex-col items-start">
                <p className="text-4xl font-black text-blue-600">
                  {formatCurrencyCLP(finalPrice)}
                </p>
                {isCompany && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full inline-block mt-2">
                    Precio Mayorista
                  </span>
                )}
                <p className="text-sm text-slate-500 mt-2">Precio neto. Impuestos calculados en el checkout.</p>
              </div>

              <div className="prose prose-slate mb-10">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Descripción del Producto</h3>
                <p className="text-slate-600 leading-relaxed">
                  Insumo médico de alta calidad certificado para uso clínico y hospitalario. 
                  Este producto cumple con todos los estándares regulatorios vigentes y garantiza 
                  la máxima seguridad para pacientes y profesionales de la salud.
                </p>
              </div>

              {/* Sección Inferior: Stock y Botón */}
              <div className="mt-auto pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-700 font-medium">Disponibilidad:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    product.stock_global > 20 ? 'bg-emerald-100 text-emerald-700' : 
                    product.stock_global > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock_global > 0 ? `${product.stock_global} unidades en stock` : 'Sin stock'}
                  </span>
                </div>

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
        </div>

      </div>
    </div>
  )
}
