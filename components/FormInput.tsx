"use client";
import React from "react";

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
};

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
type TextAreaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormInput({ label, name, required, className, ...rest }: InputProps) {
  return (
    <label className={`block text-sm ${className || ""}`}>
      <span className="mb-1 block font-medium text-zinc-700">{label}{required && <span className="text-red-600"> *</span>}</span>
      <input
        id={name}
        name={name}
        required={required}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        {...rest}
      />
    </label>
  );
}

export function FormTextArea({ label, name, required, className, ...rest }: TextAreaProps) {
  return (
    <label className={`block text-sm ${className || ""}`}>
      <span className="mb-1 block font-medium text-zinc-700">{label}{required && <span className="text-red-600"> *</span>}</span>
      <textarea
        id={name}
        name={name}
        required={required}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        rows={4}
        {...rest}
      />
    </label>
  );
}

