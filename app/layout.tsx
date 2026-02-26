import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderNav from "../components/HeaderNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TUPAD PROJECT MONITORING APP",
  description: "Local, mobile-first management for TUPAD Coordinators",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderNav />
        <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
        <footer className="fixed bottom-0 left-0 w-full text-xs z-20 border-t border-blue-900/20 bg-blue-800 text-white shadow text-center py-3">
          This system is not an official DOLE system. For internal use only.
        </footer>
      </body>
    </html>
  );
}
