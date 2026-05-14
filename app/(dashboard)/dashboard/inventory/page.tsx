
import { prisma } from "@/lib/prisma";
import { Package, AlertCircle, Plus, Search, Filter } from "lucide-react";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      category: true,
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Gestión de Inventario</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Control de stock global y catálogo de productos.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-brand-primary hover:bg-[#1A9089] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          <span>Añadir Producto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#242729] p-6 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-brand-primary/10 text-brand-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total SKU</p>
            <p className="text-2xl font-bold dark:text-white">{products.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#242729] p-6 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Stock Crítico</p>
            <p className="text-2xl font-bold dark:text-white">
              {products.filter(p => p.variants.some(v => v.stock < 10)).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#242729] rounded-xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar por nombre o SKU..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border-none rounded-lg text-sm dark:text-white focus:ring-1 focus:ring-brand-primary" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">SKUs</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Stock Total</th>
                <th className="px-6 py-4">Precio Base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {products.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                const basePrice = p.variants[0]?.price || 0;
                const skus = p.variants.map(v => v.sku).join(', ');

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="font-medium dark:text-white text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 max-w-[150px] truncate" title={skus}>
                      {skus}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                        {p.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${totalStock < 10 ? 'text-red-500' : 'dark:text-white'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold dark:text-white">
                      ${basePrice.toLocaleString('es-CL')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
