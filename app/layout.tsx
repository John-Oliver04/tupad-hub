
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import { RegisterSW } from "./register-sw";
import type { Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TUPAD Hub",
  description: "Local, mobile-first management for TUPAD Coordinators",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <RegisterSW />
        <HeaderNav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
