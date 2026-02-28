"use client";
import React from "react";
import { FadeInUp } from "./Motion";

type CardProps = {
  title?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function Card({ title, className, actions, children }: CardProps) {
  return (
    <FadeInUp className={`relative overflow-hidden rounded-xl border border-emerald-200 bg-green-50 shadow-sm transition-transform duration-300 will-change-transform hover:shadow-md hover:-translate-y-0.5 ${className || ""}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/30 blur-2xl" ></div>
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl" ></div>

      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          {title ? <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-800">{title}</h3> : <div />}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </FadeInUp>
  );
}

