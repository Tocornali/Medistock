"use client"

import React, { useState, useEffect } from "react"
import { formatRut, validateRut } from "@/lib/rut-utils"

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
        setInternalValue(formatRut(value as string));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9kK.-]/g, '');
      setInternalValue(rawValue);
      
      const valid = validateRut(rawValue);
      setIsValid(valid);
      
      if (onValidChange) {
        onValidChange(valid);
      }

      if (onChange) {
        onChange(e);
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const formatted = formatRut(e.target.value);
      setInternalValue(formatted);
      
      if (onChange) {
        const event = { ...e, target: { ...e.target, value: formatted, name: props.name || '' } } as any;
        onChange(event);
      }

      if (props.onBlur) {
        props.onBlur(e);
      }
    }

    return (
      <div>
        <input
          {...props}
          ref={ref}
          type="text"
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${className} ${!isValid && internalValue.length > 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          maxLength={12}
        />
        {!isValid && internalValue.length > 0 && (
          <p className="mt-1 text-xs text-red-500">RUT inválido</p>
        )}
      </div>
    )
  }
);

RutInput.displayName = "RutInput";

export default RutInput;
