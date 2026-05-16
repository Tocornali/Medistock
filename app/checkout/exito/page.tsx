import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CopyIdButton from '@/components/CopyIdButton'
import ClearCart from '@/components/ClearCart'
import { OrderStatus } from '@prisma/client'

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
      {(order.estado === OrderStatus.PAID || order.estado === OrderStatus.PENDING_OC_VALIDATION) && <ClearCart />}
      
      <div className="max-w-5xl w-full bg-white dark:bg-[#242729] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Columna Izquierda: Encabezado e Instrucciones (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-brand-primary/10 via-white to-slate-50 dark:from-brand-primary/5 dark:via-[#242729] dark:to-[#1A1C1E] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="w-20 h-20 bg-brand-primary rounded-[1.75rem] flex items-center justify-center mb-6 shadow-xl shadow-brand-primary/30 transform rotate-3">
                <svg className="w-10 h-10 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-brand-dark dark:text-white tracking-tight">
                {order.paymentMethod === 'TRANSFER' 
                  ? '¡Orden Generada!' 
                  : order.paymentMethod === 'PURCHASE_ORDER' || order.paymentMethod === 'INVOICE'
                    ? '¡Orden en Revisión!'
                    : '¡Pago Exitoso!'}
              </h1>
              <p className="text-brand-primary dark:text-brand-primary/90 mt-2 font-bold text-lg tracking-wide">
                {order.paymentMethod === 'TRANSFER'
                  ? 'Falta realizar la transferencia bancaria'
                  : order.paymentMethod === 'PURCHASE_ORDER' || order.paymentMethod === 'INVOICE'
                    ? 'Tu Orden de Compra está siendo validada'
                    : 'Gracias por tu compra en Medistock'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                {order.paymentMethod === 'TRANSFER'
                  ? 'Hemos reservado tus productos temporalmente. Para confirmar el pedido y proceder con el despacho, necesitamos que realices la transferencia bancaria a la brevedad.'
                  : order.paymentMethod === 'PURCHASE_ORDER' || order.paymentMethod === 'INVOICE'
                    ? 'Hemos recibido el documento oficial de tu institución. Nuestro equipo financiero verificará la autenticidad y montos de la Orden de Compra para autorizar el despacho de los productos.'
                    : 'Tu transacción ha sido confirmada exitosamente por Transbank. Ya estamos preparando tus productos para que los recibas en el tiempo estimado.'}
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Instrucciones de Transferencia */}
              {order.paymentMethod === 'TRANSFER' && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 text-amber-900 dark:text-amber-300 shadow-sm">
                  <h4 className="font-black text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Datos para Transferencia
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                    <div>
                      <span className="block text-xs text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider">Banco</span>
                      <span className="font-bold">Banco Santander</span>
                    </div>
                    <div>
                      <span className="block text-xs text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider">Cuenta Corriente</span>
                      <span className="font-mono font-bold">123456789</span>
                    </div>
                    <div>
                      <span className="block text-xs text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider">RUT</span>
                      <span className="font-mono font-bold">76.543.210-K</span>
                    </div>
                    <div>
                      <span className="block text-xs text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider">Titular</span>
                      <span className="font-bold">Medistock SpA</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-500/20 text-xs leading-relaxed">
                    Envía el comprobante a <span className="font-bold underline">pagos@medistock.com</span> indicando el Nº de Orden en el asunto.
                  </div>
                </div>
              )}

              {/* Instrucciones B2B OC */}
              {(order.paymentMethod === 'PURCHASE_ORDER' || order.paymentMethod === 'INVOICE') && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-6 text-blue-900 dark:text-blue-300 shadow-sm">
                  <h4 className="font-black text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Proceso de Aprobación
                  </h4>
                  <p className="text-sm leading-relaxed mb-4">
                    Tu documento corporativo ha sido almacenado de forma segura en nuestros servidores. El tiempo estimado de revisión por parte de nuestro departamento de Finanzas es de <span className="font-bold">2 a 4 horas hábiles</span>.
                  </p>
                  <div className="bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-blue-100 dark:border-blue-500/10 text-xs flex items-center justify-between">
                    <span>Estado del documento:</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-100 dark:bg-blue-500/20 px-2.5 py-1 rounded-md">Pendiente Validación</span>
                  </div>
                </div>
              )}

              {/* Instrucciones Webpay */}
              {order.paymentMethod === 'WEBPAY' && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 text-emerald-900 dark:text-emerald-300 shadow-sm">
                  <h4 className="font-black text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Comprobante de Transbank
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Hemos enviado una copia de la boleta/factura electrónica y el detalle de la transacción a tu correo electrónico registrado.
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Link href="/catalogo" className="w-full sm:w-auto inline-flex justify-center items-center bg-brand-dark dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-brand-dark font-black py-4 px-8 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm uppercase tracking-widest gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver al Catálogo
                </Link>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalle de la Orden (lg:col-span-5) */}
          <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between bg-white dark:bg-[#242729]">
            <div>
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
                  Resumen de Productos
                </h3>
                <div className="space-y-4 mb-6 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.isArray((order as any).cartItems) && ((order as any).cartItems).length > 0 ? (
                    ((order as any).cartItems).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm group">
                        <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-brand-primary transition-colors truncate max-w-[70%]">
                          <span className="font-black text-brand-primary mr-2 bg-brand-primary/10 px-2 py-0.5 rounded-md">{item.cantidad}x</span> 
                          {item.nombre || item.product?.name || 'Producto'}
                        </span>
                        <span className="text-slate-800 dark:text-white font-bold whitespace-nowrap">
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
            </div>

            {/* Total */}
            <div>
              <div className="flex items-center justify-between bg-brand-primary/5 dark:bg-brand-primary/10 rounded-3xl p-6 border border-brand-primary/20 dark:border-brand-primary/20 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                <span className="text-brand-dark dark:text-white font-black uppercase tracking-widest text-xs z-10">
                  {order.paymentMethod === 'WEBPAY' ? 'Total Pagado' : 'Monto a Pagar'}
                </span>
                <span className="text-3xl font-black text-brand-primary z-10">
                  {Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total)}
                </span>
              </div>
            </div>

          </div>
          
        </div>
        
      </div>
    </div>
  )
}
