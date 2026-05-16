"use client"

import { useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { submitPurchaseOrder } from "@/app/actions/checkout-b2b"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-black text-white bg-brand-primary hover:bg-[#1A9089] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Subiendo y Procesando...
        </span>
      ) : (
        "Confirmar Pago con Orden de Compra"
      )}
    </button>
  )
}

export default function PurchaseOrderForm({ cartTotal, onComplete }: { cartTotal: number, onComplete?: (orderId: string) => void }) {
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const actionHandler = async (formData: FormData) => {
    setError(null)
    
    // Anexar datos extra si es necesario (ej. el total que el cliente ve)
    formData.append("cartTotal", cartTotal.toString())
    
    const result = await submitPurchaseOrder(formData)
    
    if (!result.success) {
      setError(result.error || "Ocurrió un error inesperado")
      return
    }

    if (result.success && result.order) {
      formRef.current?.reset()
      if (onComplete) {
        onComplete(result.order.id)
      } else {
        window.location.href = `/checkout/exito?orden=${result.order.id}&method=oc`
      }
    }
  }

  return (
    <div className="bg-white dark:bg-[#242729] rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/10 mt-6">
      <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Pago con Orden de Compra</h3>
      <p className="text-sm text-slate-500 mb-6">
        Sube el PDF oficial de la Orden de Compra emitida por tu institución. Nuestro equipo de Finanzas validará el documento antes de procesar el despacho.
      </p>

      <form ref={formRef} action={actionHandler} className="space-y-6">
        
        {/* Número de OC */}
        <div>
          <label htmlFor="ocNumber" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Número de Orden de Compra <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ocNumber"
            name="ocNumber"
            required
            placeholder="Ej: OC-2023-4455"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-brand-dark/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary text-slate-900 dark:text-white transition-colors"
          />
          <p className="mt-1 text-xs text-slate-500">Asegúrate de ingresar el número exacto que aparece en el documento.</p>
        </div>

        {/* Archivo PDF */}
        <div>
          <label htmlFor="ocFile" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Documento Oficial (Solo PDF, Máx. 5MB) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl bg-slate-50 dark:bg-brand-dark/20 hover:bg-slate-100 dark:hover:bg-brand-dark/40 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                <label htmlFor="ocFile" className="relative cursor-pointer rounded-md font-medium text-brand-primary hover:text-brand-primary/80 focus-within:outline-none">
                  <span>Sube un archivo</span>
                  <input id="ocFile" name="ocFile" type="file" accept="application/pdf" required className="sr-only" />
                </label>
                <p className="pl-1">o arrástralo aquí</p>
              </div>
              <p className="text-xs text-slate-500">Solo PDF hasta 5MB</p>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <SubmitButton />
        
      </form>
    </div>
  )
}
