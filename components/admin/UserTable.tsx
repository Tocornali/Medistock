
"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import { updateUserStatus } from "@/app/actions/admin";
import { 
  MoreVertical, 
  UserCog, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Mail,
  Fingerprint
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  rut: string | null;
  email: string | null;
  role: Role;
  isActive: boolean;
}

interface UserTableProps {
  initialUsers: User[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (userId: string, data: { role?: Role, isActive?: boolean }) => {
    setLoading(true);
    const result = await updateUserStatus(userId, data);
    if (result.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      setEditingUser(null);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-[#1e2124] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Identificación</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name || "Sin nombre"}</p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-slate-400">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-xs text-gray-600 dark:text-slate-300">
                    <Fingerprint className="w-3 h-3 mr-1 text-gray-400" />
                    {user.rut || "---"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-tight uppercase ${
                    user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' :
                    user.role === 'LOGISTICS' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {user.isActive ? (
                      <span className="flex items-center text-xs font-bold text-emerald-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Activo
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-red-400">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactivo
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setEditingUser(user)}
                    className="p-2 hover:bg-brand-primary/10 rounded-lg text-gray-400 hover:text-brand-primary transition-all"
                  >
                    <UserCog className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e2124] w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gestionar Usuario</h3>
            <p className="text-sm text-gray-500 mb-6">Editando privilegios para <span className="font-bold text-brand-primary">{editingUser.name}</span></p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Rol del Sistema</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(Role).filter(r => r !== 'USER' && r !== 'COMPANY').map((r) => (
                    <button
                      key={r}
                      onClick={() => setEditingUser({ ...editingUser, role: r })}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        editingUser.role === r 
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' 
                        : 'border-gray-200 dark:border-white/5 text-gray-500 hover:border-brand-primary/50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Estado de la Cuenta</label>
                <button
                  onClick={() => setEditingUser({ ...editingUser, isActive: !editingUser.isActive })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    editingUser.isActive 
                    ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500' 
                    : 'border-red-500/50 bg-red-500/5 text-red-500'
                  }`}
                >
                  <span className="text-sm font-bold">{editingUser.isActive ? 'Cuenta Habilitada' : 'Cuenta Suspendida'}</span>
                  {editingUser.isActive ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  disabled={loading}
                  onClick={() => handleUpdate(editingUser.id, { role: editingUser.role, isActive: editingUser.isActive })}
                  className="flex-1 px-4 py-3 text-sm font-bold bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-[#1A9089] transition-all disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
