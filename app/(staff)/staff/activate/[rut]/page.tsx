"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { activateUser } from "@/app/actions/activate"

export default function StaffActivatePage({ params }: { params: { rut: string } }) {
  const router = useRouter()
  const { rut } = params

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPending(true)

    const result = await activateUser(rut, { name, email, password })

    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else {
      router.push("/staff?activated=true")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark transition-colors px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
            Activación Corporativa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400 transition-colors">
            Define tus credenciales para el RUT {rut}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Nombre Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Email Corporativo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-slate-600 bg-transparent dark:bg-brand-dark/50 px-4 py-3 text-gray-900 dark:text-white transition-colors placeholder-gray-500 focus:border-brand-primary focus:outline-none focus:ring-brand-primary/50 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
              {pending ? "Activando..." : "Activar Cuenta y Continuar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
