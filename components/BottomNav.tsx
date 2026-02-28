"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, FolderIcon, UserIcon } from "../components/Icons";



function BottomNav() {
  const pathname = usePathname();

  const navItem = (
    href: string,
    label: string,
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        aria-label={label}
        className="flex flex-1 flex-col items-center justify-center px-2 py-2"
      >
        <div
          className={`grid place-items-center rounded-2xl px-5 py-2 transition ${
            active
              ? "bg-white text-green-700 shadow-md"
              : "text-white/90 hover:text-white"
          }`}
        >
          <Icon width={26} height={26} />
        </div>
        <span
          className={`mt-1 text-[11px] font-medium leading-none ${
            active ? "text-white" : "text-white/80"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/20 bg-green-600/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-green-600/80 print:hidden">
      <div className="mx-auto flex max-w-5xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {navItem("/", "", HomeIcon)}
        {navItem("/projects", "", FolderIcon)}
        {navItem("/profile", "", UserIcon)}
      </div>
    </nav>
  );
}

export default BottomNav;