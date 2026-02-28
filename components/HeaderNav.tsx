"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FolderIcon, UserIcon } from "./Icons";
import FavIcon from "../app/favicon.png";

export default function HeaderNav() {
  return (
<header className="sticky top-0 z-20 bg-green-600/95  text-white shadow">
  <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
    <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-wide">
      T U P A D H U B
    </Link>
  </div>
</header>
  );
}
