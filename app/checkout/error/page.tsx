import Link from 'next/link'
import { ChevronLeft, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default async function CheckoutErrorPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string, orden?: string }>
}) {
  const resolvedParams = await searchParams;
  const errorType = resolvedParams.error;
  const orderId = resolvedParams.orden;

  let title = "Pago Rechazado";
  let message = "Lo sentimos, pero la transacción no pudo ser completada por Transbank.";
  let Icon = XCircle;
  let iconColor = "text-red-500";
  let bgColor = "bg-red-50 dark:bg-red-500/10";

  if (errorType === 'stock') {
    title = "Error de Stock";
    message = "Lamentablemente, algunos productos de tu carro ya no tienen stock suficiente para completar la orden.";
    Icon = AlertCircle;
    iconColor = "text-amber-500";
    bgColor = "bg-amber-50 dark:bg-amber-500/10";
  } else if (errorType === 'excepcion') {
    title = "Error del Sistema";
    message = "Ocurrió un error inesperado al procesar tu pago. Por favor, intenta nuevamente.";
    Icon = RefreshCw;
    iconColor = "text-slate-500";
    bgColor = "bg-slate-50 dark:bg-slate-500/10";
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-brand-dark/20 flex items-center justify-center p-4 lg:p-12 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-[#242729] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in duration-500">
        
        {/* Encabezado Error */}
        <div className={`${bgColor} p-10 text-center relative overflow-hidden border-b border-slate-200 dark:border-white/10`}>
          <div className="relative z-10">
            <div className={`w-24 h-24 ${bgColor} rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-white dark:border-white/5`}>
              <Icon className={`w-12 h-12 ${iconColor}`} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="p-8 lg:p-10 space-y-6">
          <div className="bg-slate-50 dark:bg-[#1A1C1E] rounded-3xl p-6 border border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">
              No se ha realizado ningún cargo a tu cuenta.
            </p>
            {orderId && (
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Referencia: #{orderId.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Link 
              href="/carrito" 
              className="w-full flex justify-center items-center bg-brand-primary hover:bg-[#1A9089] text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm uppercase tracking-widest gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar Pago
            </Link>
            
            <Link 
              href="/catalogo" 
              className="w-full flex justify-center items-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold py-4 px-6 rounded-2xl transition-all text-sm uppercase tracking-widest gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al Catálogo
            </Link>
          </div>

          <p className="text-[10px] text-slate-400 text-center font-medium uppercase tracking-tight">
            Si el problema persiste, contacta a soporte@medistock.cl
          </p>
        </div>
      </div>
    </div>
  );
}
