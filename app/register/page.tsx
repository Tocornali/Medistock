"use client"

import { useState } from "react"
import { registerUser } from "@/app/actions/register"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RutInput from "@/components/RutInput"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<"PERSONA" | "EMPRESA">("PERSONA")

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await registerUser(formData)
      if (result?.error) {
        setError(result.error)
        setPending(false)
      } else if (result?.success) {
        router.push("/login")
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Regístrate en Medistock para comenzar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="accountType" value={accountType} />
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setAccountType("PERSONA")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                accountType === "PERSONA" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Persona
            </button>
            <button
              type="button"
              onClick={() => setAccountType("EMPRESA")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                accountType === "EMPRESA" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Empresa
            </button>
          </div>

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 pr-20 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {accountType === "EMPRESA" && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-medium text-slate-900">Datos de la Empresa</h3>
                <div>
                  <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-1">
                    RUT Empresa
                  </label>
                  <RutInput
                    id="rut"
                    name="rut"
                    required={accountType === "EMPRESA"}
                    className="mt-1 block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="76.123.456-7"
                  />
                </div>
                <div>
                  <label htmlFor="razonSocial" className="block text-sm font-medium text-slate-700 mb-1">
                    Razón Social
                  </label>
                  <input
                    id="razonSocial"
                    name="razonSocial"
                    type="text"
                    required={accountType === "EMPRESA"}
                    className="mt-1 block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Mi Empresa SpA"
                  />
                </div>
                <div>
                  <label htmlFor="giro" className="block text-sm font-medium text-slate-700 mb-1">
                    Giro
                  </label>
                  <input
                    id="giro"
                    name="giro"
                    type="text"
                    required={accountType === "EMPRESA"}
                    className="mt-1 block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Venta al por mayor de..."
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center py-2 rounded-md font-medium">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pending ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-600">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
