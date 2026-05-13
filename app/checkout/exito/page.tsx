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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Orden no encontrada</h1>
        <p className="text-slate-600 mb-8">No pudimos encontrar la información de tu compra.</p>
        <Link href="/catalogo" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {order.estado === 'PAGADO' && <ClearCart />}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Encabezado Verde */}
        <div className="bg-green-500 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">¡Pago Exitoso!</h1>
          <p className="text-green-100 mt-2 font-medium">Gracias por tu compra en Medistock</p>
        </div>

        {/* Detalles del Recibo */}
        <div className="p-8">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-slate-500 text-sm font-semibold">Número de Orden</span>
              <div className="flex items-center">
                <span className="text-slate-800 font-mono font-bold text-sm bg-white px-2 py-1 rounded shadow-sm">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <CopyIdButton fullId={order.id} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-sm font-semibold mt-0.5">Logística</span>
                <div className="text-right max-w-[60%]">
                  <span className="block text-slate-800 font-bold">
                    {order.deliveryMethod === 'DOMICILIO' ? 'Envío a Domicilio' : 'Retiro en Tienda'}
                  </span>
                  {order.deliveryMethod === 'DOMICILIO' && order.address && (
                    <span className="block text-sm text-slate-500 mt-1 leading-tight">
                      {order.address.split('. Contacto:')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalle de la compra */}
          <div className="mb-6 px-2">
            <h3 className="text-slate-800 font-bold mb-3 text-sm uppercase tracking-wide">Detalle de la compra</h3>
            <div className="space-y-3 mb-4">
              {Array.isArray((order as any).cartItems) && ((order as any).cartItems).length > 0 ? (
                ((order as any).cartItems).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      <span className="font-bold mr-2">{item.cantidad}x</span> 
                      {item.nombre || item.product?.nombre || 'Producto'}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format((item.precio || 0) * item.cantidad)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">
                  (Sin detalle de productos)
                </div>
              )}
            </div>
            <div className="border-b border-slate-200"></div>
          </div>

          <div className="flex items-center justify-between bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <span className="text-blue-900 font-bold">Total Pagado</span>
            <span className="text-2xl font-black text-blue-700">
              {Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total)}
            </span>
          </div>

          <Link href="/catalogo" className="w-full flex justify-center items-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Volver al catálogo
          </Link>
        </div>
        
      </div>
    </div>
  )
}
