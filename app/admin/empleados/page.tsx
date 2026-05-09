"use client"

import { useState } from "react"
import { preRegisterEmployee } from "@/app/actions/admin"

export default function AdminEmpleadosPage() {
  const [rut, setRut] = useState("")
  const [role, setRole] = useState("LOGISTICS")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setPending(true)

    const result = await preRegisterEmployee({ rut, role })

    if (result?.error) {
      setError(result.error)
    } else {
      setMessage(`Empleado pre-registrado exitosamente con RUT ${rut}.`)
      setRut("")
    }
    setPending(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pre-registro de Empleados</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">RUT del Empleado</label>
            <input
              type="text"
              required
              placeholder="12345678-9"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rol a asignar</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="LOGISTICS">Logística (LOGISTICS)</option>
              <option value="FINANCE">Finanzas (FINANCE)</option>
              <option value="SALES">Ventas (SALES)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Pre-registrar Empleado"}
          </button>
        </form>
      </div>
    </div>
  )
}
