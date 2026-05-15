import { prisma } from '@/lib/prisma'
import { Building2, User } from 'lucide-react'

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ['USER', 'COMPANY'] }
    },
    orderBy: {
      email: 'asc'
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Clientes</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Listado de todos los clientes (Minoristas e Institucionales) registrados en la plataforma.</p>
      </div>

      <div className="bg-white dark:bg-[#242729] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1A1C1E] border-b border-slate-200 dark:border-white/10 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Tipo</th>
                <th className="p-4">Nombre / Razón Social</th>
                <th className="p-4">RUT</th>
                <th className="p-4">Email</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    {user.role === 'COMPANY' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                        <Building2 className="w-3 h-3" />
                        B2B
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400">
                        <User className="w-3 h-3" />
                        B2C
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {user.role === 'COMPANY' ? user.razonSocial : user.name}
                    </p>
                    {user.role === 'COMPANY' && user.giro && (
                      <p className="text-xs text-slate-500 line-clamp-1">{user.giro}</p>
                    )}
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    {user.rut || 'No Registrado'}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {user.email || 'Sin Email'}
                  </td>
                  <td className="p-4">
                    {user.isActive ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Activo"></span>
                    ) : (
                      <span className="inline-block w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" title="Inactivo"></span>
                    )}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No hay clientes registrados en el sistema.
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
