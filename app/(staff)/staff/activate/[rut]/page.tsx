"use client"

import { useState, use } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema, type AuthSchema } from "@/lib/validations/auth"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { activateUser } from "@/app/actions/activate"

const staffActivateSchema = authSchema.extend({
  name: z.string().min(1, "El nombre es obligatorio"),
})

type StaffActivateData = z.infer<typeof staffActivateSchema>

export default function StaffActivatePage({ params }: { params: Promise<{ rut: string }> }) {
  const router = useRouter()
  const { rut } = use(params)

  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

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
              <input
                {...register("password")}
                id="password"
                type="password"
                className={`mt-1 block w-full appearance-none rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm`}
                placeholder="••••••••"
              />
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
