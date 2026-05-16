import { prisma } from '@/lib/prisma'
import { formatCurrencyCLP } from '@/lib/utils'
import { OrderStatus } from '@prisma/client'

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
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark/50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 dark:text-brand-light mb-8">Mis Órdenes</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-brand-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-500 dark:text-slate-400">Aún no tienes órdenes registradas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-brand-dark p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mb-1">ID: {order.id}</p>
                  <p className="font-bold text-slate-800 dark:text-brand-light text-lg">
                    Total: {formatCurrencyCLP(order.total)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Envío: {order.deliveryMethod}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    order.estado === OrderStatus.PAID 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : order.estado === OrderStatus.PENDING_OC_VALIDATION
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
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
