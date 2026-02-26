"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, FolderIcon, UserIcon } from "../components/Icons";



function BottomNav() {
  const pathname = usePathname();

  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex flex-col items-center justify-center text-xs transition ${
          active ? "text-blue-700 font-semibold" : "text-zinc-500"
        }`}
      >
        <Icon />
        {label}
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white shadow-inner print:hidden">
      <div className="mx-auto flex max-w-5xl justify-around py-2">
        {navItem("/", "Home", HomeIcon)}
        {navItem("/projects", "Projects", FolderIcon)}
        {navItem("/profile", "Profile", UserIcon)}
      </div>
    </div>
  );
}

export default BottomNav;