"use client";

import { CreditCard, FileText, Upload, CheckCircle2, Banknote } from "lucide-react";
import { PaymentMethod } from "@prisma/client";

interface PaymentSelectorProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  ocFile: File | null;
  setOcFile: (file: File | null) => void;
  isCompany: boolean;
}

export default function PaymentSelector({ 
  paymentMethod, 
  setPaymentMethod, 
  ocFile, 
  setOcFile, 
  isCompany 
}: PaymentSelectorProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Por favor, sube un archivo PDF");
        return;
      }
      setOcFile(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción Webpay */}
        <button
          type="button"
          className={`relative flex flex-col p-6 border-2 rounded-[2rem] transition-all text-left ${
            paymentMethod === PaymentMethod.WEBPAY
              ? "border-brand-primary bg-brand-primary/5 shadow-md"
              : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
          }`}
          onClick={() => setPaymentMethod(PaymentMethod.WEBPAY)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            {paymentMethod === PaymentMethod.WEBPAY && <CheckCircle2 className="w-6 h-6 text-brand-primary fill-brand-primary/10" />}
          </div>
          <span className="font-black text-slate-900 dark:text-white text-lg">Webpay Plus</span>
          <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Tarjeta de Débito / Crédito</span>
        </button>

        {/* Opción Transferencia */}
        <button
          type="button"
          className={`relative flex flex-col p-6 border-2 rounded-[2rem] transition-all text-left ${
            paymentMethod === PaymentMethod.TRANSFER
              ? "border-brand-primary bg-brand-primary/5 shadow-md"
              : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
          }`}
          onClick={() => setPaymentMethod(PaymentMethod.TRANSFER)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Banknote className="w-6 h-6" />
            </div>
            {paymentMethod === PaymentMethod.TRANSFER && <CheckCircle2 className="w-6 h-6 text-brand-primary fill-brand-primary/10" />}
          </div>
          <span className="font-black text-slate-900 dark:text-white text-lg">Transferencia Bancaria</span>
          <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Aprobación Manual</span>
        </button>

        {/* Opción Orden de Compra (Solo B2B) */}
        {isCompany && (
          <button
            type="button"
            className={`relative flex flex-col p-6 border-2 rounded-[2rem] transition-all text-left ${
              paymentMethod === PaymentMethod.INVOICE
                ? "border-brand-primary bg-brand-primary/5 shadow-md"
                : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
            onClick={() => setPaymentMethod(PaymentMethod.INVOICE)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              {paymentMethod === PaymentMethod.INVOICE && <CheckCircle2 className="w-6 h-6 text-brand-primary fill-brand-primary/10" />}
            </div>
            <span className="font-black text-slate-900 dark:text-white text-lg">Orden de Compra</span>
            <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Pago a 30 días</span>
          </button>
        )}
      </div>

      {/* Subida de OC para Empresas con OC seleccionado */}
      {paymentMethod === PaymentMethod.INVOICE && isCompany && (
        <div className="mt-6 p-8 bg-slate-50 dark:bg-black/20 rounded-[2.5rem] border-2 border-dashed border-slate-300 dark:border-white/10 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-brand-primary" />
            </div>
            <p className="text-lg font-black text-slate-900 dark:text-white mb-1">
              {ocFile ? "Documento Cargado" : "Sube tu Orden de Compra (PDF)"}
            </p>
            <p className="text-sm text-slate-500 mb-6">Documento obligatorio para procesar el pedido B2B</p>
            
            <input
              type="file"
              id="oc-upload"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="oc-upload"
              className="px-8 py-3 bg-brand-primary hover:bg-[#1A9089] rounded-xl text-sm font-black text-white cursor-pointer transition-all shadow-lg shadow-brand-primary/10 active:scale-95"
            >
              {ocFile ? "Cambiar Archivo" : "Seleccionar PDF"}
            </label>
            
            {ocFile && (
              <div className="mt-6 flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold truncate max-w-[200px]">{ocFile.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

