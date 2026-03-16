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
    <div className="flex items-start gap-4 rounded-xl border border-earth-200/80 bg-white/60 px-4 py-3 transition-colors hover:border-leaf-200 hover:bg-white/80">
      <input
        type="checkbox"
        id={id}
        className="mt-1 h-5 w-5 shrink-0 rounded-md border-earth-300 text-leaf-600 focus:ring-2 focus:ring-leaf-500 focus:ring-offset-0"
        {...props}
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-earth-800">
          {label}
        </label>
        {helperText && (
          <p className="mt-0.5 text-xs leading-relaxed text-earth-600">{helperText}</p>
        )}
      </div>
    </div>
  );
}
