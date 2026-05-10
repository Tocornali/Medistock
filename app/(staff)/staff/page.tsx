"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import RutInput from "@/components/RutInput"
import { checkStaffAccount } from "@/app/actions/staff"
import { Shield, ArrowRight, Lock, ArrowLeft } from "lucide-react"

export default function StaffLoginPage() {
  const router = useRouter()
  const [rut, setRut] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPending(true)

    const result = await signIn("credentials", {
      rut,
      password,
      portal: "STAFF",
      redirect: false,
    })

    if (result?.error) {
      if (result.error.includes("INACTIVE_ACCOUNT")) {
        const inactiveRut = result.error.split(":")[1];
        setError("Esta cuenta no está activa. Por favor usa la opción de Activar Cuenta abajo.");
      } else if (result.error.includes("USE_CLIENT_PORTAL")) {
        setError("Esta cuenta es de cliente. Usa el login público.");
      } else {
        setError("Credenciales incorrectas.");
      }
      setPending(false)
    } else {
      const session = await getSession()
      const role = (session?.user as any)?.role
      
      if (role === 'LOGISTICS') {
        router.push("/dashboard/inventory")
      } else if (role === 'ADMIN' || role === 'FINANCE') {
        router.push("/dashboard/admin")
      } else if (role === 'SALES') {
        router.push("/dashboard/orders")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    }
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPending(true)

    const result = await signIn("credentials", {
      rut,
      password,
      portal: "STAFF",
      redirect: false,
    })

    if (result?.error) {
      setError("Contraseña incorrecta.")
      setPending(false)
    } else {
      const session = await getSession()
      const role = (session?.user as any)?.role
      
      if (role === 'LOGISTICS') {
        router.push("/dashboard/inventory")
      } else if (role === 'ADMIN' || role === 'FINANCE') {
        router.push("/dashboard/admin")
      } else if (role === 'SALES') {
        router.push("/dashboard/orders")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen relative items-center justify-center bg-gray-50 dark:bg-brand-dark transition-colors px-4 py-12 sm:px-6 lg:px-8">
      {/* Botón de retroceso al portal de clientes */}
      <a 
        href="/login" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white transition-colors transition-colors text-sm font-medium z-10"
        title="Volver al inicio de sesión de clientes"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Volver a Clientes</span>
      </a>

      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg relative z-20">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors tracking-tight">
            Intranet Medistock
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400 transition-colors">
            Acceso exclusivo para personal autorizado
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 pl-10 pr-3 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
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
              className="group relative flex w-full justify-center rounded-md border border-transparent dark:border-white/10 bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {pending ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <a href="/staff/activate" className="text-sm font-medium text-brand-primary hover:text-[#1A9089] dark:text-brand-primary transition-colors">
              ¿Eres nuevo? Activa tu cuenta de empleado
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
