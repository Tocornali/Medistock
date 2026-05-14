
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrencyCLP } from "@/lib/utils";
import { Check, Package, Info, AlertCircle, ShieldCheck } from "lucide-react";

interface VariantSelectorProps {
  product: {
    id: string;
    name: string;
    isInstitutionalOnly: boolean;
    requiereReceta: boolean;
  };
  variants: {
    id: string;
    sku: string;
    nameModifier: string;
    price: number;
    companyPrice: number;
    stock: number;
    weight?: number;
  }[];
  onVariantChange?: (variantId: string) => void;
}

export default function VariantSelector({ product, variants, onVariantChange }: VariantSelectorProps) {
  const { data: session } = useSession();
  const isCompany = session?.user?.role === "COMPANY";

  // Encontrar la primera variante con stock, o la primera si ninguna tiene
  const initialVariant = variants.find(v => v.stock > 0) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);

  useEffect(() => {
    if (selectedVariant && onVariantChange) {
      onVariantChange(selectedVariant.id);
    }
  }, [selectedVariant, onVariantChange]);

  if (!variants || variants.length === 0) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2"><AlertCircle size={20}/> No hay variantes disponibles.</div>;
  }

  // Verificar restricción institucional
  if (product.isInstitutionalOnly && !isCompany) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 dark:text-amber-100">Equipamiento Restringido</h4>
          <p className="text-sm text-amber-800/80 dark:text-amber-300/80">
            Venta exclusiva para instituciones de salud y empresas registradas.
            Inicie sesión corporativa para ver precios y comprar.
          </p>
        </div>
        <button className="mt-2 text-sm font-bold text-amber-900 dark:text-amber-200 underline underline-offset-4">
          Solicitar cuenta empresa
        </button>
      </div>
    );
  }

  const activePrice = isCompany ? selectedVariant.companyPrice : selectedVariant.price;

  return (
    <div className="space-y-6">
      {/* Selector de Atributos (Ej: Talla o Formato) */}
      <div>
        <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
          Seleccione Opción
        </label>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                selectedVariant.id === v.id
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                  : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
              } ${v.stock === 0 ? "opacity-50 grayscale" : ""}`}
            >
              {v.nameModifier}
              {v.stock === 0 && <span className="ml-2 text-[10px] uppercase">(Sin Stock)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Precio y Disponibilidad */}
      <div className="bg-slate-50 dark:bg-black/20 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Precio {isCompany ? "Corporativo" : "Venta Directa"}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {formatCurrencyCLP(activePrice)}
              <span className="text-sm font-normal text-slate-400 ml-2">IVA incl.</span>
            </h3>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
            selectedVariant.stock > 0 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" 
              : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
          }`}>
            <Package size={14} />
            {selectedVariant.stock > 0 ? `En Stock: ${selectedVariant.stock}` : "Agotado"}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
          {product.requiereReceta && !isCompany && (
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
              <Info size={14} />
              Requiere receta médica para la compra
            </div>
          )}
          {product.requiereReceta && isCompany && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ShieldCheck size={14} />
              Compra sujeta a Resolución Sanitaria vigente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
