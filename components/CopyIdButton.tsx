'use client'

import { useState } from 'react'

export default function CopyIdButton({ fullId }: { fullId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 text-xs px-2 py-1 rounded transition-colors font-semibold flex items-center gap-1 ${
        copied 
          ? 'bg-green-100 text-green-700' 
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
      }`}
      title="Copiar ID completo"
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          ¡Copiado!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copiar
        </>
      )}
    </button>
  )
}
