import { prisma } from "@/lib/prisma"
import { formatCurrencyCLP } from "@/lib/utils"

export default async function RecentOrdersTable() {
  // 5. Últimas 5 transacciones
  const recientes = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  return (
    <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-white/5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Órdenes Recientes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/5 transition-colors">
            <tr>
              <th className="px-6 py-4">ID Orden</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {recientes.length > 0 ? (
              recientes.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400 transition-colors">
                    {order.id.split('-')[0]}...
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white transition-colors">
                    {order.user?.name || order.user?.rut || 'Cliente Desconocido'}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 transition-colors">
                    {formatCurrencyCLP(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold transition-colors ${
                      ['PAGADO', 'COMPLETED', 'AUTHORIZATION_OK'].includes(order.estado) 
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                    }`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 transition-colors">
                    {new Date(order.createdAt).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No hay transacciones recientes registradas en la base de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
