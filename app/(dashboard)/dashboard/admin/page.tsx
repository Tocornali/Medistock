import { Suspense } from "react"
import SummaryCards from "@/components/admin/SummaryCards"
import SummaryCardsSkeleton from "@/components/skeletons/SummaryCardsSkeleton"
import RecentOrdersTable from "@/components/admin/RecentOrdersTable"
import RecentOrdersSkeleton from "@/components/skeletons/RecentOrdersSkeleton"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Layout general síncrono */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Panel de Resumen</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Visión general del estado de la distribuidora.</p>
      </div>

      {/* Boundary para las tarjetas de resumen (métricas globales) */}
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <SummaryCards />
      </Suspense>

      {/* Boundary para la tabla de órdenes recientes */}
      <Suspense fallback={<RecentOrdersSkeleton />}>
        <RecentOrdersTable />
      </Suspense>
    </div>
  )
}
