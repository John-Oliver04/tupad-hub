"use client";
import Link from "next/link";
import { ArrowRightIcon, FolderIcon, HomeIcon, UserIcon } from "../components/Icons";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";
import type { Profile } from "../utils/types";

export default function Home() {
  const [profile] = useLocalStorage<Profile>(STORAGE_KEYS.profile, {
    fullName: "",
    position: "",
    municipality: "",
    contactNumber: "",
    avatarUrl: "",
    coverUrl: "",
  });
  const initials = (profile.fullName || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const firstName =
    profile.fullName
      ?.split(" ")
      .filter(Boolean)[0] || "Coordinator";

return (
  <div className="min-h-screen pb-6">

    {/* Welcome Hero */}
    <div className="px-4 mt-4">
      <section className="relative overflow-hidden rounded-2xl bg-green-50 text-slate-900 shadow-md">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/30 blur-2xl" ></div>
        <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl" ></div>

        <div className="relative p-5 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className="text-emerald-700">TUPAD Coordinator workspace</span>
          </div>

          <h1
            className="text-2xl font-extrabold text-emerald-700 tracking-tight sm:text-3xl"
            style={{
              fontFamily:
                "Impact, Haettenschweiler, 'Arial Narrow Bold', system-ui, sans-serif",
            }}
          >
            Welcome, {firstName}
          </h1>

          <p className="text-sm text-emerald-700 leading-relaxed">
            Manage your profile, create TUPAD projects, and record implementation
            details in one focused, mobile-first hub.
          </p>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm active:scale-[0.98]"
            >
              <FolderIcon width={18} height={18} />
              <span>Open projects</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-700/40 px-3 py-2 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              <UserIcon width={18} height={18} />
              <span>Update profile</span>
            </Link>
          </div>

          <p className="mt-2 text-[11px] text-red-700/50">
            Note: This is not an official DOLE application. For personal use
            only.
          </p>
        </div>
      </section>
    </div>

  </div>
);
}
