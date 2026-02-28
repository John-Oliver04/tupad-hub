"use client";
import Link from "next/link";
import Card from "../components/Card";
import Image from "next/image";
import { ArrowRightIcon, FolderIcon, HomeIcon, UserIcon } from "../components/Icons";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";
import type { Profile } from "../utils/types";
import MyLogo from '../app/favicon.png';

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

return (
  <div className="min-h-screen bg-zinc-100 pb-6">

    {/* Top App Header */}
    <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border bg-zinc-200">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Coordinator avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-700">
              {initials}
            </div>
          )}
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold text-zinc-900">
            {profile.fullName || "Coordinator"}
          </p>
          <p className="text-xs text-zinc-500">
            {profile.position || "TUPAD Coordinator"}
          </p>
        </div>
      </div>

      <Image
        src={MyLogo}
        alt="TUPAD Hub logo"
        className="h-8 w-auto"
        priority
      />
    </div>

    {/* Welcome Card */}
    <div className="px-4 mt-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="flex items-center gap-2 font-semibold text-zinc-800 mb-2">
          <HomeIcon />
          <span >
            Welcome
          </span>
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Manage your profile, create TUPAD projects, and record implementation details.
          <br /><br />
          <span className="text-xs text-red-500">
            Note: This is not an official DOLE application. For personal use only.
          </span>
        </p>
      </div>
    </div>

    {/* Main Action Buttons */}
    <div className="px-4 mt-4 space-y-3">

      <Link href="/profile" className="block">
        <div className="bg-white rounded-xl shadow-sm p-4 active:scale-[0.98] transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <UserIcon />
              </div>
              <div>
                <p className="font-medium text-zinc-800">Profile</p>
                <p className="text-xs text-zinc-500">
                  Manage coordinator information
                </p>
              </div>
            </div>
            <ArrowRightIcon />
          </div>
        </div>
      </Link>

      <Link href="/projects" className="block">
        <div className="bg-white rounded-xl shadow-sm p-4 active:scale-[0.98] transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <FolderIcon />
              </div>
              <div>
                <p className="font-medium text-zinc-800">Projects</p>
                <p className="text-xs text-zinc-500">
                  Create and track TUPAD projects
                </p>
              </div>
            </div>
            <ArrowRightIcon />
          </div>
        </div>
      </Link>

    </div>

  </div>
);
}
