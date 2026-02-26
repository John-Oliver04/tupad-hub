"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FolderIcon, UserIcon } from "./Icons";
import FavIcon from "../app/favicon.png";

export default function HeaderNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-blue-900/20 bg-blue-800 text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-wide">
          <Image src={FavIcon} alt="Logo" width={22} height={22} className="rounded" />
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
