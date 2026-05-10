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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Panel de Resumen</h1>
        <p className="text-slate-500 mt-1">Visión general del estado de la distribuidora.</p>
      </div>

      {/* Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ventas Totales</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrencyCLP(ventasTotales)}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Órdenes Pendientes</p>
            <p className="text-2xl font-bold text-slate-900">{ordenesPendientes}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Clientes Empresa</p>
            <p className="text-2xl font-bold text-slate-900">{nuevosClientesEmpresa}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Alertas de Stock</p>
            <p className="text-2xl font-bold text-slate-900">{alertasStock}</p>
          </div>
        </div>

      </div>

      {/* Tabla de Órdenes Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Órdenes Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID Orden</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recientes.length > 0 ? (
                recientes.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {order.id.split('-')[0]}...
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {order.user?.name || order.user?.rut || 'Cliente Desconocido'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {formatCurrencyCLP(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                        ['PAGADO', 'COMPLETED', 'AUTHORIZATION_OK'].includes(order.estado) 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
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
