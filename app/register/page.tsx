"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterSchema } from "@/lib/validations/auth"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/actions/register"
import Link from "next/link"
import RutInput from "@/components/RutInput"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      accountType: "PERSONA",
      name: "",
      email: "",
      password: "",
      rut: "",
      razonSocial: "",
      giro: ""
    }
  })

  const accountType = watch("accountType")

  const toggleAccountType = (type: "PERSONA" | "EMPRESA") => {
    reset({
      accountType: type,
      name: "",
      email: "",
      password: "",
      rut: "",
      razonSocial: "",
      giro: ""
    })
    setError(null)
  }

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

  const onSubmit = async (data: RegisterSchema) => {
    setError(null)
    setPending(true)
    
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value)
    })
    
    try {
      const result = await registerUser(formData)
      
      if (result?.error) {
        setError(result.error)
        setPending(false)
      } else if (result?.success) {
        // Auto-login tras el registro exitoso utilizando el callbackUrl de NextAuth
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/catalogo"
        })
      }
    } catch (err) {

      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.")
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-brand-dark transition-colors px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg border border-slate-100 dark:border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white transition-colors tracking-tight">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 transition-colors">
            Regístrate en Medistock para comenzar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex bg-slate-100 dark:bg-brand-dark/50 p-1 rounded-lg border border-transparent dark:border-white/10 transition-colors relative">
            <button
              type="button"
              onClick={() => toggleAccountType("PERSONA")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer active:scale-95 ${
                accountType === "PERSONA" 
                  ? "bg-white dark:bg-brand-dark text-slate-900 dark:text-white shadow-sm border border-transparent dark:border-white/10" 
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              Persona
            </button>
            <button
              type="button"
              onClick={() => toggleAccountType("EMPRESA")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer active:scale-95 ${
                accountType === "EMPRESA" 
                  ? "bg-white dark:bg-brand-dark text-slate-900 dark:text-white shadow-sm border border-transparent dark:border-white/10" 
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5"
              }`}
            >
              Empresa
            </button>
          </div>

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
                Nombre Completo
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                autoComplete="off"
                className={`mt-1 block w-full appearance-none rounded-md border ${errors.name ? 'border-red-500' : ''} bg-transparent dark:bg-brand-dark/50 px-3 py-2 text-slate-900 dark:text-white transition-colors placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                placeholder="Juan Pérez"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
                Correo Electrónico
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="off"
                className={`mt-1 block w-full appearance-none rounded-md border ${errors.email ? 'border-red-500' : ''} bg-transparent dark:bg-brand-dark/50 px-3 py-2 text-slate-900 dark:text-white transition-colors placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  className={`mt-1 block w-full appearance-none rounded-md border ${errors.password ? 'border-red-500' : ''} bg-transparent dark:bg-brand-dark/50 px-3 py-2 pr-20 text-slate-900 dark:text-white transition-colors placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                  placeholder="••••••••"
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors focus:outline-none"
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {accountType === "EMPRESA" && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Datos de la Empresa</h3>
                <div>
                  <label htmlFor="rut" className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
                    RUT Empresa
                  </label>
                  <RutInput
                    {...register("rut")}
                    id="rut"
                    className={`mt-1 block w-full appearance-none rounded-md border ${errors.rut ? 'border-red-500' : ''} bg-transparent dark:bg-brand-dark/50 px-3 py-2 text-slate-900 dark:text-white transition-colors placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                    placeholder="76.123.456-7"
                    onChange={(e) => setValue("rut", e.target.value, { shouldValidate: true })}
                  />
                  {errors.rut && <p className="mt-1 text-xs text-red-500">{errors.rut.message}</p>}
                </div>
                <div>
                  <label htmlFor="razonSocial" className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
                    Razón Social
                  </label>
                  <input
                    {...register("razonSocial")}
                    id="razonSocial"
                    type="text"
                    className={`mt-1 block w-full appearance-none rounded-md border ${errors.razonSocial ? 'border-red-500' : ''} bg-transparent dark:bg-brand-dark/50 px-3 py-2 text-slate-900 dark:text-white transition-colors placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                    placeholder="Mi Empresa SpA"
                  />
                  {errors.razonSocial && <p className="mt-1 text-xs text-red-500">{errors.razonSocial.message}</p>}
                </div>
                <div>
                  <label htmlFor="giro" className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors mb-1">
                    Giro
                  </label>
                  <input
                    {...register("giro")}
                    id="giro"
                    type="text"
                    className={`mt-1 block w-full appearance-none rounded-md border ${errors.giro ? 'border-red-500' : ''} bg-transparent dark:bg-brand-dark/50 px-3 py-2 text-slate-900 dark:text-white transition-colors placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                    placeholder="Venta al por mayor de..."
                  />
                  {errors.giro && <p className="mt-1 text-xs text-red-500">{errors.giro.message}</p>}
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
              disabled={pending || !isValid}
              className="group relative flex w-full justify-center rounded-md border border-transparent dark:border-white/10 bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pending ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">¿Ya tienes una cuenta? </span>
            <Link href="/login" className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-primary transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
