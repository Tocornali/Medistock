import { prisma } from "@/lib/prisma"
import { formatCurrencyCLP } from "@/lib/utils"
import { DollarSign, Clock, Building2, AlertTriangle } from "lucide-react"
import { OrderStatus } from "@prisma/client"

export default async function SummaryCards() {
  // 1. Ventas Totales
  const ventasResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { 
      estado: { in: [OrderStatus.PAID, OrderStatus.INVOICED] } 
    }
  })
  const ventasTotales = ventasResult._sum?.total || 0

  // 2. Órdenes Pendientes
  const ordenesPendientes = await prisma.order.count({
    where: {
      estado: { in: [OrderStatus.PENDING_OC_VALIDATION, OrderStatus.OC_APPROVED, OrderStatus.SHIPPED] }
    }
  })

  // 3. Nuevos Clientes Empresa
  const nuevosClientesEmpresa = await prisma.user.count({
    where: { role: 'COMPANY' }
  })

  // 4. Alertas de Stock
  const alertasStock = await prisma.product.count({
    where: {
      variants: {
        some: {
          stock: { lt: 10 }
        }
      }
    }
  })

  return (
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
        <div className="w-12 h-12 rounded-full bg-brand-primary/10 dark:bg-brand-primary/80/20 flex items-center justify-center text-brand-primary dark:text-brand-primary/90 shrink-0">
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
  )
}
