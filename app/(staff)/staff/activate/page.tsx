"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import RutInput from "@/components/RutInput"
import { checkStaffAccount } from "@/app/actions/staff"
import { ArrowRight, UserCheck } from "lucide-react"

export default function StaffActivatePreCheckPage() {
  const router = useRouter()
  const [rut, setRut] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPending(true)

    const status = await checkStaffAccount(rut)
    
    if (status.error === "USE_CLIENT_PORTAL") {
      setError("Esta cuenta es de cliente. Por favor usa el portal público (/login).")
      setPending(false)
      return
    }

    if (!status.exists) {
      setError("No se encontró ningún empleado con este RUT. Habla con tu administrador.")
      setPending(false)
      return
    }

    if (status.exists && status.isActive) {
      setError("Tu cuenta ya está activa. Por favor, inicia sesión normalmente.")
      setPending(false)
      return
    }

    // Si existe y no está activa, lo redirigimos a la página de activación final
    router.push(`/staff/activate/${rut}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Activar Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Ingresa tu RUT corporativo para comenzar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-slate-300 mb-2">
              RUT Corporativo
            </label>
            <RutInput
              id="rut"
              name="rut"
              required
              className="block w-full appearance-none rounded-md border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-colors"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center py-2 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="group relative flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50"
            >
              {pending ? 'Verificando...' : 'Verificar Estado'}
              {!pending && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-slate-700">
            <a href="/staff" className="text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors">
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
