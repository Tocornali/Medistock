import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
import { FileText, Building2, CheckCircle2, XCircle } from "lucide-react"
import { formatCurrencyCLP } from "@/lib/utils"
import { approvePurchaseOrder, rejectPurchaseOrder } from "@/app/actions/admin-orders"

export default async function OrderReviewList() {
  // 1. Lectura de Base de Datos (Server Component)
  const pendingOrders = await prisma.order.findMany({
    where: { estado: OrderStatus.PENDING_OC_VALIDATION },
    include: { user: true },
    orderBy: { createdAt: 'asc' }
  });

  if (pendingOrders.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-[#242729] rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="font-bold">No hay Órdenes de Compra pendientes de revisión.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pendingOrders.map((order) => (
        <div key={order.id} className="bg-white dark:bg-[#242729] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Información Clínica y Orden */}
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-black text-slate-900 dark:text-white text-lg">
                  {order.user.razonSocial || order.user.name}
                </h4>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-md uppercase tracking-wider">
                  Revisión Pendiente
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mb-2">
                RUT: {order.user.rut}
              </p>
              <div className="flex gap-4 text-sm font-medium">
                <p className="text-slate-700 dark:text-slate-300">Total: <span className="font-black text-brand-primary">{formatCurrencyCLP(order.total)}</span></p>
                <p className="text-slate-700 dark:text-slate-300">OC N°: <span className="font-black">{order.ocNumber}</span></p>
              </div>
            </div>
          </div>

          {/* Acciones y PDF */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
            
            {/* Visor PDF B2B (Target _blank) */}
            <a 
              href={order.ocDocumentUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ver PDF Original
            </a>

            <div className="flex gap-2 w-full sm:w-auto">
              {/* Aprobar OC (Server Action Form) */}
              <form 
                action={async () => {
                  "use server"
                  await approvePurchaseOrder(order.id);
                }} 
                className="flex-1"
              >
                <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  Aprobar
                </button>
              </form>

              {/* Rechazar OC (Server Action Form) */}
              <form 
                action={async (formData) => {
                  "use server"
                  const reason = formData.get('reason') as string;
                  await rejectPurchaseOrder(order.id, reason);
                }} 
                className="flex-1 flex"
              >
                {/* Nota: En producción esto sería un Modal de Cliente para pedir el texto, aquí usamos un truco con un input oculto y un prompt nativo simulado o valor fijo para cumplir el requisito puramente de servidor */}
                <input type="hidden" name="reason" value="Los precios del PDF no coinciden con la cotización de plataforma." />
                <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg font-bold text-sm transition-colors">
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
              </form>
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}
