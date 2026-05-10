"use client"

import React, { useState, useEffect } from "react"
import { formatRut, validateRut } from "@/lib/rut-utils"

interface RutInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValidChange?: (isValid: boolean) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RutInput({ onValidChange, className, value, onChange, ...props }: RutInputProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(formatRut(value as string));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setInternalValue(formatted);
    
    const valid = validateRut(formatted);
    setIsValid(valid);
    
    if (onValidChange) {
      onValidChange(valid);
    }

    if (onChange) {
      // Modificamos el evento para pasar el valor formateado
      const event = { ...e, target: { ...e.target, value: formatted, name: props.name || '' } } as any;
      onChange(event);
    }
  }

  return (
    <div>
      <input
        {...props}
        type="text"
        value={internalValue}
        onChange={handleChange}
        className={`${className} ${!isValid && internalValue.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        maxLength={12}
      />
      {!isValid && internalValue.length > 0 && (
        <p className="mt-1 text-xs text-red-500">RUT inválido</p>
      )}
    </div>
  )
}
