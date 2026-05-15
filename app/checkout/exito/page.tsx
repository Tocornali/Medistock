import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CopyIdButton from '@/components/CopyIdButton'
import ClearCart from '@/components/ClearCart'

export default async function CheckoutExitoPage({
  searchParams
}: {
  searchParams: Promise<{ orden?: string }>
}) {
  const resolvedParams = await searchParams;
  const buyOrder = resolvedParams.orden;

  if (!buyOrder || buyOrder === 'undefined') {
    redirect('/catalogo');
  }

  // Buscamos la orden
  const order = await prisma.order.findFirst({
    where: {
      id: { startsWith: buyOrder }
    }
  });

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-brand-dark/20 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="bg-white dark:bg-[#242729] rounded-[3rem] border border-slate-200 dark:border-white/10 p-12 text-center max-w-md w-full shadow-2xl">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-4">Orden no encontrada</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">No pudimos encontrar la información de tu compra. Verifica el número de orden.</p>
          <Link href="/catalogo" className="w-full inline-flex justify-center bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-brand-dark/20 flex items-center justify-center p-4 lg:p-12 transition-colors">
      {(order.estado === 'PAGADO' || order.estado === 'PENDIENTE_APROBACION') && <ClearCart />}
      
      <div className="max-w-md w-full bg-white dark:bg-[#242729] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Encabezado */}
        <div className="bg-brand-primary/10 dark:bg-brand-primary/5 p-10 text-center relative overflow-hidden border-b border-brand-primary/20 dark:border-brand-primary/10">
          {/* Fondo decorativo */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-primary/30 transform rotate-3">
              <svg className="w-12 h-12 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-black text-brand-dark dark:text-white tracking-tight">¡Pago Exitoso!</h1>
            <p className="text-brand-primary dark:text-brand-primary/90 mt-2 font-bold tracking-wide">Gracias por tu compra en Medistock</p>
          </div>
        </div>

        {/* Detalles del Recibo */}
        <div className="p-8 lg:p-10">
          <div className="bg-slate-50 dark:bg-[#1A1C1E] rounded-3xl p-6 border border-slate-100 dark:border-white/5 mb-8 shadow-inner">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Nº de Orden</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-800 dark:text-white font-mono font-bold text-sm bg-white dark:bg-[#242729] px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-white/10">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <CopyIdButton fullId={order.id} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Logística</span>
                <div className="text-right max-w-[60%]">
                  <span className="block text-slate-800 dark:text-white font-bold text-sm">
                    {order.deliveryMethod === 'DOMICILIO' ? 'Envío a Domicilio' : 'Retiro en Tienda'}
                  </span>
                  {order.deliveryMethod === 'DOMICILIO' && order.address && (
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                      {order.address.split('. Contacto:')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalle de la compra */}
          <div className="mb-8 px-2">
            <h3 className="text-slate-800 dark:text-white font-black mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-brand-primary rounded-full"></div>
              Resumen
            </h3>
            <div className="space-y-4 mb-6">
              {Array.isArray((order as any).cartItems) && ((order as any).cartItems).length > 0 ? (
                ((order as any).cartItems).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm group">
                    <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-brand-primary transition-colors">
                      <span className="font-black text-brand-primary mr-2 bg-brand-primary/10 px-2 py-0.5 rounded-md">{item.cantidad}x</span> 
                      {item.nombre || item.product?.name || 'Producto'}
                    </span>
                    <span className="text-slate-800 dark:text-white font-bold">
                      {Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format((item.precio || 0) * item.cantidad)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 dark:text-slate-500 italic font-medium">
                  (Sin detalle de productos)
                </div>
              )}
            </div>
            <div className="border-b-2 border-dashed border-slate-200 dark:border-white/10"></div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-brand-primary/5 dark:bg-brand-primary/10 rounded-3xl p-6 mb-10 border border-brand-primary/20 dark:border-brand-primary/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            <span className="text-brand-dark dark:text-white font-black uppercase tracking-widest text-xs z-10">Total Pagado</span>
            <span className="text-3xl font-black text-brand-primary z-10">
              {Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total)}
            </span>
          </div>

          <Link href="/catalogo" className="w-full flex justify-center items-center bg-brand-dark dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-brand-dark font-black py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm uppercase tracking-widest">
            Seguir Comprando
          </Link>
        </div>
        
      </div>
    </div>
  )
}
