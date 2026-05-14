
import { Construction } from "lucide-react";

export default function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
      <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center">
        <Construction className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sección en Construcción</h2>
        <p className="text-gray-500 dark:text-slate-400">Estamos trabajando para habilitar el módulo de Reportes e Inventario Crítico.</p>
      </div>
    </div>
  );
}
