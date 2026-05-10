import { prisma } from "@/lib/prisma"
import { formatCurrencyCLP } from "@/lib/utils"
import { 
  DollarSign, 
  Clock, 
  Building2, 
  AlertTriangle 
} from "lucide-react"

export default async function AdminDashboardPage() {
  // 1. Ventas Totales (Suma de órdenes pagadas)
  // Asumiremos que el estado de pago exitoso es "PAGADO" o "COMPLETED"
  const ventasResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { 
      estado: { in: ['PAGADO', 'COMPLETED', 'AUTHORIZATION_OK'] } 
    }
  })
  const ventasTotales = ventasResult._sum.total || 0

  // 2. Órdenes Pendientes (Enviado o Procesando)
  // Los estados reales en la base de datos podrían variar, usaremos los solicitados.
  const ordenesPendientes = await prisma.order.count({
    where: {
      estado: { in: ['ENVIADO', 'PROCESANDO', 'PENDIENTE_PAGO', 'PENDING'] }
    }
  })

  // 3. Nuevos Clientes Empresa (Role: COMPANY)
  const nuevosClientesEmpresa = await prisma.user.count({
    where: { role: 'COMPANY' }
  })

  // 4. Alertas de Stock (Productos con stock < 10)
  const alertasStock = await prisma.product.count({
    where: { stock_global: { lt: 10 } }
  })

  // 5. Últimas 5 transacciones
  const recientes = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Panel de Resumen</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Visión general del estado de la distribuidora.</p>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ventas Totales</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrencyCLP(ventasTotales)}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Órdenes Pendientes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{ordenesPendientes}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 dark:bg-brand-primary/80/20 flex items-center justify-center text-brand-primary dark:text-brand-primary/90 dark:text-brand-primary shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Clientes Empresa</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{nuevosClientesEmpresa}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 p-6 flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Alertas de Stock</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{alertasStock}</p>
          </div>
        </div>

      </div>

      {/* Tabla de Órdenes Recientes */}
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
    </div>
  )
}
