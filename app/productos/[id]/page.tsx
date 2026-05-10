import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import { formatCurrencyCLP } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'
import { 
  Package, 
  FileText, 
  Settings, 
  Download, 
  ShieldCheck, 
  Truck, 
  ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  const session = await auth()
  const user = session?.user as any
  const finalPrice = calculatePrice(product, user)
  const isCompany = user?.role === 'COMPANY'

  const specs = (product.especificaciones as Record<string, string>) || {}

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark/20 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Volver */}
        <Link 
          href="/catalogo" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Catálogo
        </Link>

        <div className="bg-white dark:bg-[#242729] rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Imagen del producto */}
            <div className="lg:w-full bg-slate-100 dark:bg-white/5 flex items-center justify-center p-12 min-h-[400px] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.nombre}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                />
              ) : (
                <Package className="w-32 h-32 text-slate-300 dark:text-slate-700" />
              )}
            </div>

            {/* Información Principal */}
            <div className="p-12 space-y-8">
              <div>
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/20">
                  {product.category || 'Insumo'}
                </span>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-4 tracking-tight leading-tight">
                  {product.nombre}
                </h1>
                <p className="text-sm font-mono text-slate-400 mt-2">SKU: {product.sku}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precio Vigente</p>
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-black text-[#1A9089] dark:text-brand-primary tracking-tighter">
                    {formatCurrencyCLP(finalPrice)}
                  </p>
                  {isCompany && (
                    <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold">
                      Precio Empresa
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm">Garantía de Calidad Certificada</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Truck className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm">Envío Express a todo Chile</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/10">
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

          {/* Detalles Técnicos y Descripción */}
          <div className="border-t border-slate-200 dark:border-white/10 p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Descripción Comercial */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <FileText className="w-6 h-6 text-brand-primary" />
                  Descripción del Producto
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.descripcion || 'Este producto médico cumple con los más altos estándares de calidad de la industria. Diseñado para ofrecer confiabilidad y precisión en entornos clínicos exigentes.'}
                </p>
                
                {/* Documentos Relacionados */}
                <div className="pt-8 space-y-4">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Documentación Técnica</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-brand-primary transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Ficha Técnica.pdf</p>
                          <p className="text-[10px] text-slate-500">PDF - 1.2 MB</p>
                        </div>
                      </div>
                    </button>
                    <button className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-brand-primary transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Certificado ISP.pdf</p>
                          <p className="text-[10px] text-slate-500">PDF - 0.8 MB</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Especificaciones Técnicas (Tabla) */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Settings className="w-6 h-6 text-brand-primary" />
                  Especificaciones
                </h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                      {Object.entries(specs).map(([key, value]) => (
                        <tr key={key} className="bg-white dark:bg-transparent">
                          <th className="px-4 py-3 font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 w-1/3 capitalize">
                            {key.replace('_', ' ')}
                          </th>
                          <td className="px-4 py-3 text-slate-900 dark:text-white">
                            {value}
                          </td>
                        </tr>
                      ))}
                      {Object.keys(specs).length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-8 text-center text-slate-400 italic">
                            No se han definido especificaciones técnicas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
