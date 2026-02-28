"use client";
import React, { useEffect } from "react";
import { Fade, ScaleIn } from "./Motion";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, actions, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <Fade className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <ScaleIn className="w-full max-w-lg rounded-xl bg-white shadow-xl">
          {(title || actions) && (
            <div className="flex items-center justify-between border-b bg-emerald-700/40 border-zinc-200 px-5 py-3">
              <h3 className="text-base font-semibold text-emerald-800">{title}</h3>
              <div className="flex items-center gap-2">
                {actions}
                <button
                  onClick={onClose}
                  className="rounded-md border border-zinc-300 bg-white text-red-600 px-3 py-1.5 text-sm hover:text-red-700 hover:bg-emerald-700/40"
                >
                  x
                </button>
              </div>
            </div>
          )}
          <div className="p-5">{children}</div>
        </ScaleIn>
      </div>
    </div>
  );
}
