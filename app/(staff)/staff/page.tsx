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
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

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
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 pl-10 pr-20 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {capsLockActive && (
                  <div 
                    className="absolute inset-y-0 right-10 flex items-center pointer-events-none"
                    title="Bloq Mayús está activado"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary/80 dark:text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                )}
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
