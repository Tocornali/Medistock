
"use client"

import React, { useState, useEffect } from "react"
import { formatRut, validateRut, cleanRut } from "@/lib/rut-utils"

interface RutInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValidChange?: (isValid: boolean) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RutInput = React.forwardRef<HTMLInputElement, RutInputProps>(
  ({ onValidChange, className, value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value || "");
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(formatRut(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 1. Obtener valor y limpiar caracteres no permitidos
      let inputVal = e.target.value.replace(/[^0-9kK.-]/g, '');
      
      // 2. Si el usuario está borrando, permitimos que lo haga sin forzar formato inmediato
      // Pero si está escribiendo, formateamos dinámicamente
      const cleaned = cleanRut(inputVal);
      const formatted = formatRut(cleaned);
      
      setInternalValue(formatted);
      
      // 3. Validar
      const valid = cleaned.length >= 7 ? validateRut(cleaned) : true;
      setIsValid(valid);
      
      if (onValidChange) {
        onValidChange(valid);
      }

      // 4. Propagar el evento con el valor formateado
      if (onChange) {
        const event = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
            name: props.name || ''
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }

    return (
      <div className="w-full">
        <input
          {...props}
          ref={ref}
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder="12.345.678-9"
          className={`${className} ${!isValid && internalValue.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20' : ''} transition-all`}
          maxLength={12}
        />
        {!isValid && internalValue.length >= 7 && (
          <p className="mt-1.5 text-[11px] font-bold text-red-500 uppercase tracking-tight">RUT no válido</p>
        )}
      </div>
    )
  }
);

RutInput.displayName = "RutInput";

export default RutInput;
