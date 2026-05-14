
"use client";

import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface QuantitySelectorProps {
  max: number;
  initial?: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({ max, initial = 1, onChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initial);

  useEffect(() => {
    // Si el máximo cambia (ej: cambia la variante) y la cantidad actual es mayor, ajustar
    if (quantity > max) {
      const newQty = Math.max(1, max);
      setQuantity(newQty);
      onChange(newQty);
    }
  }, [max]);

  const handleIncrement = () => {
    if (quantity < max) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onChange(newQty);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange(newQty);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Si está vacío, permitimos que el usuario borre para escribir, pero no disparamos el cambio
    if (val === "") {
      setQuantity(0);
      return;
    }

    const num = parseInt(val);
    if (!isNaN(num)) {
      const clamped = Math.min(Math.max(1, num), max);
      setQuantity(clamped);
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    // Al perder el foco, si el valor quedó en 0 o vacío, forzamos a 1
    if (quantity < 1) {
      setQuantity(1);
      onChange(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Seleccionar Cantidad
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1 w-fit">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <Minus size={18} />
            </button>
            
            <input
              type="number"
              value={quantity === 0 ? "" : quantity}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-16 text-center bg-transparent border-none focus:ring-0 font-bold text-lg text-slate-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
              onClick={handleIncrement}
              disabled={quantity >= max}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Atajos Mayoristas */}
          <div className="flex gap-2">
            {[10, 50, 100].filter(val => val <= max).map(val => (
              <button
                key={val}
                onClick={() => {
                  setQuantity(val);
                  onChange(val);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all border ${
                  quantity === val 
                    ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20" 
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:border-brand-primary/50"
                }`}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {quantity >= max && max > 0 && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold animate-pulse flex items-center gap-1">
          <Plus size={10} /> Límite máximo alcanzado para este producto ({max} uds.)
        </p>
      )}
    </div>
  );
}

