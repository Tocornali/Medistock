"use client"

import { useState } from "react"
import { preRegisterEmployee } from "@/app/actions/admin"
import RutInput from "@/components/RutInput"

export default function AdminEmpleadosPage() {
  const [rut, setRut] = useState("")
  const [isRutValid, setIsRutValid] = useState(false)
  const [role, setRole] = useState("LOGISTICS")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    
    if (!rut) {
      setError("El RUT es obligatorio.")
      return
    }
    
    if (!isRutValid) {
      setError("Por favor, ingresa un RUT válido.")
      return
    }
    
    setPending(true)

    const result = await preRegisterEmployee({ rut, role })

    if (result?.error) {
      setError(result.error)
    } else {
      setMessage(`Empleado pre-registrado exitosamente con RUT ${rut}.`)
      setRut("")
      setIsRutValid(false)
    }
    setPending(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md mx-auto bg-white dark:bg-[#242729] p-8 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 transition-colors">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">Pre-registro de Empleados</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">RUT del Empleado</label>
            <RutInput
              required
              placeholder="12.345.678-9"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-[#1C1F21] dark:text-white px-3 py-2 focus:border-brand-primary focus:ring-brand-primary/50 sm:text-sm transition-colors"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              onValidChange={setIsRutValid}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Rol a asignar</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-white/20 dark:bg-[#1C1F21] dark:text-white px-3 py-2 focus:border-brand-primary focus:ring-brand-primary/50 sm:text-sm transition-colors"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="LOGISTICS">Logística (LOGISTICS)</option>
              <option value="FINANCE">Finanzas (FINANCE)</option>
              <option value="SALES">Ventas (SALES)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </select>
          </div>

          {error && <div className="text-red-600 dark:text-red-400 text-sm transition-colors">{error}</div>}
          {message && <div className="text-green-600 dark:text-green-400 text-sm transition-colors">{message}</div>}

          <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50 disabled:opacity-50 transition-colors"
          >
            {pending ? "Guardando..." : "Pre-registrar Empleado"}
          </button>
        </form>
      </div>
    </div>
  )
}
