"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema } from "@/lib/validations/auth"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { activateUser } from "@/app/actions/activate"

const staffActivateSchema = authSchema.extend({
  name: z.string().min(1, "El nombre es obligatorio"),
})

type StaffActivateData = z.infer<typeof staffActivateSchema>

export default function StaffActivateForm({ rut }: { rut: string }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<StaffActivateData>({
    resolver: zodResolver(staffActivateSchema),
    mode: "onChange"
  })

  const onSubmit = async (data: StaffActivateData) => {
    setError("")
    setPending(true)

    const result = await activateUser(rut, data)

    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else {
      router.push("/staff?activated=true")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark transition-colors px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg border border-transparent dark:border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
            Activación Corporativa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400 transition-colors">
            Define tus credenciales para el RUT {rut}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Nombre Completo
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className={`mt-1 block w-full appearance-none rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                placeholder="Ej: Pedro González"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Email Corporativo
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className={`mt-1 block w-full appearance-none rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                placeholder="pedro@medistock.cl"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`mt-1 block w-full appearance-none rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-transparent dark:bg-brand-dark/50 px-4 py-3 pr-20 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                  placeholder="••••••••"
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
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
              disabled={pending || !isValid}
              className="group relative flex w-full justify-center rounded-md border border-transparent dark:border-white/10 bg-brand-primary px-4 py-3 text-sm font-bold text-white hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Activando..." : "Activar Cuenta y Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
