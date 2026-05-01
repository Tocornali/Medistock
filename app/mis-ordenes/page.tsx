import { prisma } from '@/lib/prisma'
import { formatCurrencyCLP } from '@/lib/utils'

export default async function MisOrdenesPage() {
  // En el futuro, aquí obtendrías el ID del usuario de la sesión (Auth.js)
  // Por ahora, simulamos buscando las órdenes del usuario fallback o las últimas órdenes.
  const orders = await prisma.order.findMany({
    orderBy: {
      // Como no tenemos createdAt en el esquema, ordenaremos por ID o simplemente tomaremos las últimas
      id: 'desc'
    },
    take: 10
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-8">Mis Órdenes</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-slate-500">Aún no tienes órdenes registradas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-mono mb-1">ID: {order.id}</p>
                  <p className="font-bold text-slate-800">
                    Total: {formatCurrencyCLP(order.total)}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Envío: {order.deliveryMethod}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    order.estado === 'PAGADO' 
                      ? 'bg-green-100 text-green-700' 
                      : order.estado === 'PENDIENTE_PAGO'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {order.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
