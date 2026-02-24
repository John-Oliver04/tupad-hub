"use client";
import Link from "next/link";
import React from "react";
import { FolderIcon, UserIcon } from "./Icons";

export default function HeaderNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-900/20 bg-blue-800 text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-semibold tracking-wide">
          TUPAD HUB
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-md px-3 py-1.5 hover:bg-blue-700 transition-colors flex items-center gap-1.5" href="/profile">
            <UserIcon />
            Profile
          </Link>
          <Link className="rounded-md px-3 py-1.5 hover:bg-blue-700 transition-colors flex items-center gap-1.5" href="/projects">
            <FolderIcon />
            Projects
          </Link>
        </nav>
      </div>
    </header>
  );
}
