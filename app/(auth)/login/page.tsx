"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { checkAccountStatus } from "@/app/actions/login"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPending(true)

    const status = await checkAccountStatus(email)
    if (status.exists && !status.isActive && status.rut) {
      router.push(`/auth/activate/${status.rut}`)
      setPending(false)
      return
    }

    const result = await signIn("credentials", {
      email,
      password,
      portal: "CLIENT",
      redirect: false,
    })

    if (result?.error) {
      if (result.error.includes("USE_STAFF_PORTAL")) {
        setError("Esta cuenta pertenece al personal. Por favor ingresa por la Intranet Corporativa (/staff).")
      } else {
        setError("Credenciales inválidas")
      }
      setPending(false)
    } else {
      const session = await getSession()
      const role = (session?.user as any)?.role
      
      if (role === 'LOGISTICS') {
        router.push("/dashboard/inventory")
      } else if (role === 'ADMIN' || role === 'FINANCE') {
        router.push("/dashboard/admin")
      } else {
        router.push("/")
      }
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg border border-transparent dark:border-white/10 transition-colors">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400 transition-colors">
            Accede a tu cuenta de Medistock
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm transition-colors"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 px-4 py-3 pr-20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm transition-colors"
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
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {pending ? 'Iniciando Sesión...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center mt-4 pt-4 border-t border-slate-100 dark:border-white/10 transition-colors">
            <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">¿No tienes cuenta? </span>
            <Link href="/register" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-primary transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
