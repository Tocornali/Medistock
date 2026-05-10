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
    <div className="flex min-h-screen relative items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      {/* Botón de retroceso al portal de clientes */}
      <a 
        href="/login" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium z-10"
        title="Volver al inicio de sesión de clientes"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Volver a Clientes</span>
      </a>

      <div className="w-full max-w-md space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 relative z-20">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
            Intranet Medistock
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Acceso exclusivo para personal autorizado
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md border border-slate-600 bg-slate-700/50 pl-10 pr-3 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
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
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50"
            >
              {pending ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-slate-700">
            <a href="/staff/activate" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              ¿Eres nuevo? Activa tu cuenta de empleado
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
