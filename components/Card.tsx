"use client";
import React from "react";

type CardProps = {
  title?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function Card({ title, className, actions, children }: CardProps) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm transition-transform duration-300 will-change-transform hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up ${className || ""}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          {title ? <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-800">{title}</h3> : <div />}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

