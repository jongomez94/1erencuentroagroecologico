"use client";

import { InputHTMLAttributes } from "react";

interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  helperText?: string;
}

export default function CheckboxField({
  id,
  label,
  helperText,
  className = "",
  ...props
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={id}
        className="mt-1 h-4 w-4 rounded border-earth-300 text-leaf-600 focus:ring-leaf-500"
        {...props}
      />
      <div className="flex-1">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-earth-800">
          {label}
        </label>
        {helperText && (
          <p className="mt-0.5 text-xs text-earth-600">{helperText}</p>
        )}
      </div>
    </div>
  );
}
