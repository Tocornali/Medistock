
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-dark px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-[#1e2124] p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Acceso Denegado</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">No tienes los privilegios necesarios para acceder a esta sección administrativa.</p>
        </div>
        <Link 
          href="/staff" 
          className="inline-flex items-center space-x-2 text-brand-primary font-bold hover:underline transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al portal de personal</span>
        </Link>
      </div>
    </div>
  );
}
