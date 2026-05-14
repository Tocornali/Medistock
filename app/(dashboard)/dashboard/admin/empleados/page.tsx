
"use client";

import { useState, useEffect } from "react";
import { Role } from "@prisma/client";
import { updateUserStatus, preRegisterEmployee } from "@/app/actions/admin";
import { 
  UserCog, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Mail,
  Fingerprint,
  UserPlus,
  Search,
  ChevronRight
} from "lucide-react";
import RutInput from "@/components/RutInput";

interface User {
  id: string;
  name: string | null;
  rut: string | null;
  email: string | null;
  role: Role;
  isActive: boolean;
}

export default function AdminEmpleadosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPreRegister, setShowPreRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State para pre-registro
  const [newRut, setNewRut] = useState("");
  const [isRutValid, setIsRutValid] = useState(false);
  const [newRole, setNewRole] = useState("LOGISTICS");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data);
  };

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

  const handlePreRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!isRutValid) {
      setError("Por favor, ingresa un RUT válido.");
      return;
    }
    
    setLoading(true);
    const result = await preRegisterEmployee({ rut: newRut, role: newRole });

    if (result?.error) {
      setError(result.error);
    } else {
      setMessage(`Empleado pre-registrado exitosamente.`);
      setNewRut("");
      setIsRutValid(false);
      fetchUsers();
      setTimeout(() => setShowPreRegister(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Personal</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">Control de acceso y roles para el personal corporativo.</p>
        </div>
        <button 
          onClick={() => setShowPreRegister(true)}
          className="flex items-center justify-center space-x-2 bg-brand-primary hover:bg-[#1A9089] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Pre-registrar Staff</span>
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white dark:bg-[#1e2124] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">RUT</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs uppercase">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name || "Sin nombre"}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{user.email || "Sin email (Pre-registro)"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 dark:text-slate-300 font-mono">
                    {user.rut || "---"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' :
                      user.role === 'LOGISTICS' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="flex items-center text-xs font-bold text-emerald-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Activo
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-amber-500">
                        <XCircle className="w-3 h-3 mr-1" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2 hover:bg-brand-primary/10 rounded-lg text-gray-400 hover:text-brand-primary"
                    >
                      <UserCog className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pre-registro */}
      {showPreRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e2124] w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pre-registrar Empleado</h3>
            <form onSubmit={handlePreRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">RUT</label>
                <RutInput
                  required
                  placeholder="12.345.678-9"
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none"
                  value={newRut}
                  onChange={(e) => setNewRut(e.target.value)}
                  onValidChange={setIsRutValid}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rol</label>
                <select 
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="LOGISTICS">Logística</option>
                  <option value="FINANCE">Finanzas</option>
                  <option value="SALES">Ventas</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              {message && <p className="text-xs text-emerald-500">{message}</p>}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPreRegister(false)} className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-3 text-sm font-bold bg-brand-primary text-white rounded-xl hover:bg-[#1A9089] transition-all disabled:opacity-50">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edición (Existente) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e2124] w-full max-w-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Gestionar Usuario</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Rol</label>
                <div className="grid grid-cols-2 gap-2">
                  {['ADMIN', 'LOGISTICS', 'FINANCE', 'SALES'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setEditingUser({ ...editingUser, role: r as Role })}
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Estado</label>
                <button
                  onClick={() => setEditingUser({ ...editingUser, isActive: !editingUser.isActive })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    editingUser.isActive 
                    ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500' 
                    : 'border-red-500/50 bg-red-500/5 text-red-500'
                  }`}
                >
                  <span className="text-sm font-bold">{editingUser.isActive ? 'Activo' : 'Suspendido'}</span>
                  {editingUser.isActive ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setEditingUser(null)} className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancelar</button>
                <button onClick={() => handleUpdate(editingUser.id, { role: editingUser.role, isActive: editingUser.isActive })} disabled={loading} className="flex-1 px-4 py-3 text-sm font-bold bg-brand-primary text-white rounded-xl hover:bg-[#1A9089] transition-all disabled:opacity-50">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
