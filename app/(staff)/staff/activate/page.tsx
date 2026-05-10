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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark transition-colors px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors tracking-tight">
            Activar Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400 transition-colors">
            Ingresa tu RUT corporativo para comenzar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors mb-2">
              RUT Corporativo
            </label>
            <RutInput
              id="rut"
              name="rut"
              required
              className="block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm transition-colors"
              placeholder="12.345.678-9"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="group relative flex w-full justify-center items-center gap-2 rounded-md border border-transparent dark:border-white/10 bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {pending ? 'Verificando...' : 'Verificar Estado'}
              {!pending && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <a href="/staff" className="text-sm font-medium text-brand-primary hover:text-[#1A9089] dark:text-brand-primary transition-colors">
              Volver al inicio de sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
