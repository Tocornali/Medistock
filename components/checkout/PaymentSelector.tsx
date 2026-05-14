
"use client";

import { useState } from "react";
import { CreditCard, FileText, Upload, CheckCircle2 } from "lucide-react";

interface PaymentSelectorProps {
  accountType: "PERSONA" | "EMPRESA";
  onSelect: (method: "WEBPAY" | "INVOICE", file?: File) => void;
}

export default function PaymentSelector({ accountType, onSelect }: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"WEBPAY" | "INVOICE">("WEBPAY");
  const [ocFile, setOcFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Por favor, sube un archivo PDF");
        return;
      }
      setOcFile(file);
      onSelect(selectedMethod, file);
    }
  };

  const handleMethodChange = (method: "WEBPAY" | "INVOICE") => {
    setSelectedMethod(method);
    onSelect(method, ocFile || undefined);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">
        Método de Pago
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción Webpay (Disponible para todos) */}
        <label
          className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all ${
            selectedMethod === "WEBPAY"
              ? "border-brand-primary bg-blue-50/30 shadow-md"
              : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
          }`}
          onClick={() => handleMethodChange("WEBPAY")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            {selectedMethod === "WEBPAY" && <CheckCircle2 className="w-5 h-5 text-brand-primary" />}
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Pago Seguro Webpay</span>
          <span className="text-xs text-slate-500 mt-1">Débito o Crédito</span>
        </label>

        {/* Opción Factura (Solo Empresas) */}
        {accountType === "EMPRESA" && (
          <label
            className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all ${
              selectedMethod === "INVOICE"
                ? "border-brand-primary bg-blue-50/30 shadow-md"
                : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
            onClick={() => handleMethodChange("INVOICE")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              {selectedMethod === "INVOICE" && <CheckCircle2 className="w-5 h-5 text-brand-primary" />}
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Facturación a 30 días</span>
            <span className="text-xs text-slate-500 mt-1">Exclusivo B2B</span>
          </label>
        )}
      </div>

      {/* Subida de OC para Empresas con Factura seleccionada */}
      {selectedMethod === "INVOICE" && accountType === "EMPRESA" && (
        <div className="mt-6 p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10">
          <div className="flex flex-col items-center text-center">
            <Upload className="w-8 h-8 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sube tu Orden de Compra (PDF)
            </p>
            <p className="text-xs text-slate-500 mb-4">Documento obligatorio para procesar la factura</p>
            
            <input
              type="file"
              id="oc-upload"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="oc-upload"
              className="px-6 py-2 bg-white dark:bg-[#242729] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-white cursor-pointer hover:bg-slate-50 transition-colors"
            >
              {ocFile ? "Cambiar Archivo" : "Seleccionar PDF"}
            </label>
            
            {ocFile && (
              <div className="mt-4 flex items-center space-x-2 text-emerald-500">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold truncate max-w-[200px]">{ocFile.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
