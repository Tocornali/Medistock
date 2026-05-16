import { prisma } from '@/lib/prisma'
import { formatCurrencyCLP } from '@/lib/utils'
import DashboardCharts from './DashboardCharts'
import DashboardFilters from './DashboardFilters'
import { DollarSign, Clock, AlertTriangle, Users } from 'lucide-react'

import { requireStrictAuth } from '@/lib/auth-validator'
import { Role, PaymentMethod, OrderStatus } from '@prisma/client'

// Interfaz para la tabla de últimas órdenes
interface B2BOrder {
  id: string;
  total: number;
  createdAt: Date;
  user: {
    name: string | null;
    rut: string | null;
  }
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>
}) {
  // 1. Aplicamos el validador estricto de sesión (JWT + Base de Datos)
  // Requerimos que el usuario sea ADMIN o FINANCE
  const user = await requireStrictAuth([Role.ADMIN, Role.FINANCE]);

  const resolvedParams = await searchParams;
  const periodo = resolvedParams.periodo || '30d';

  // Configurar la fecha de inicio según el filtro
  const startDate = new Date();
  if (periodo === '7d') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (periodo === '30d') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (periodo === '1y') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  // Realizar consultas en paralelo usando Promise.all
  const [
    ventasData,
    ordenesPendientes,
    stockCritico,
    usuariosActivos,
    ultimasOrdenesB2B,
    ventasParaGrafico
  ] = await Promise.all([
    // 1. Suma de totalAmount de órdenes 'PAID'
    prisma.order.aggregate({
      where: { 
        estado: OrderStatus.PAID,
        createdAt: { gte: startDate }
      },
      _sum: { total: true }
    }),
    
    // 2. Órdenes Pendientes (PENDING_OC_VALIDATION)
    prisma.order.count({
      where: { 
        estado: OrderStatus.PENDING_OC_VALIDATION,
        createdAt: { gte: startDate }
      }
    }),
    
    // 3. Stock Crítico (< 10)
    prisma.productVariant.count({
      where: { stock: { lt: 10 } }
    }),
    
    // 4. Usuarios Activos
    prisma.user.count({
      where: { isActive: true }
    }),

    // 5. Últimas 5 órdenes B2B pendientes de aprobación
    prisma.order.findMany({
      where: { 
        paymentMethod: PaymentMethod.PURCHASE_ORDER,
        estado: OrderStatus.PENDING_OC_VALIDATION
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, rut: true } }
      }
    }),

    // 6. Órdenes para el gráfico
    prisma.order.findMany({
      where: { 
        estado: OrderStatus.PAID,
        createdAt: { gte: startDate }
      },
      select: { 
        createdAt: true, 
        total: true, 
        paymentMethod: true 
      },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  const ventasTotales = ventasData._sum.total || 0;

  // Procesar datos para el gráfico (agrupar por fecha local)
  const chartDataMap = new Map<string, { date: string, b2b: number, b2c: number }>();
  
  ventasParaGrafico.forEach(order => {
    // Formato de fecha corto (ej: "15 May")
    const dateStr = order.createdAt.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
    
    if (!chartDataMap.has(dateStr)) {
      chartDataMap.set(dateStr, { date: dateStr, b2b: 0, b2c: 0 });
    }
    
    const dayData = chartDataMap.get(dateStr)!;
    if (order.paymentMethod === PaymentMethod.PURCHASE_ORDER || order.paymentMethod === PaymentMethod.TRANSFER) {
      dayData.b2b += order.total;
    } else {
      dayData.b2c += order.total;
    }
  });

  const chartData = Array.from(chartDataMap.values());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel Administrativo</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Métricas en tiempo real y estado general de la plataforma.</p>
        </div>
        <DashboardFilters />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-[#242729] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 flex items-start gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ventas Totales</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatCurrencyCLP(ventasTotales)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242729] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 flex items-start gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Órdenes Pendientes</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ordenesPendientes}</p>
          </div>
        </div>

        <div className={`bg-white dark:bg-[#242729] rounded-2xl p-6 shadow-sm border ${stockCritico > 0 ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'} flex items-start gap-4 relative overflow-hidden`}>
          {stockCritico > 0 && <div className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse" />}
          <div className={`p-3 rounded-xl ${stockCritico > 0 ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-500'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Stock Crítico</p>
            <p className={`text-2xl font-black mt-1 ${stockCritico > 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
              {stockCritico} <span className="text-sm font-medium text-slate-500">productos</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242729] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 flex items-start gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Usuarios Activos</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{usuariosActivos}</p>
          </div>
        </div>

      </div>

      {/* Gráfico y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico AreaChart (Toma 2 columnas en lg) */}
        <div className="lg:col-span-2">
          {chartData.length > 0 ? (
            <DashboardCharts data={chartData} />
          ) : (
            <div className="w-full h-[400px] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-400">
              <DollarSign className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No hay datos de ventas en este periodo</p>
            </div>
          )}
        </div>

        {/* Tabla Últimas Órdenes B2B */}
        <div className="bg-white dark:bg-[#242729] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Aprobaciones B2B Pendientes</h3>
          
          {ultimasOrdenesB2B.length > 0 ? (
            <div className="space-y-4 flex-1">
              {ultimasOrdenesB2B.map((orden) => (
                <div key={orden.id} className="p-4 bg-slate-50 dark:bg-[#1A1C1E] rounded-xl border border-slate-100 dark:border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{orden.user.name || 'Empresa'}</p>
                      <p className="text-xs text-slate-500 font-mono">{orden.user.rut}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-black uppercase px-2 py-1 rounded-md">
                      Pendiente
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-200 dark:border-white/10">
                    <p className="text-xs text-slate-400 font-medium">Hace {Math.floor((new Date().getTime() - orden.createdAt.getTime()) / (1000 * 60 * 60))} hrs</p>
                    <p className="text-sm font-black text-brand-primary">{formatCurrencyCLP(orden.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
              <Clock className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-bold text-center">No hay órdenes B2B pendientes de aprobación</p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
