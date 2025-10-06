"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import LocaleSwitcher from "./locale-switcher";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar({ lang }: { lang: string }) {
  const pathname = usePathname();

  // ambil segmen URL, contoh: "/id/produk" => ["", "id", "produk"]
  const segments = pathname.split("/").filter(Boolean);
  const currentLang = segments[0]; // "id" atau "en"
  const currentPath = "/" + (segments[1] ?? ""); // "/produk"

  const menu = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/produk" },
    { label: "Artikel", href: "/article" },
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak Kami", href: "/contact" },
  ];

  return (
    <nav className="w-full bg-primary p-6">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between ${poppins.className}`}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href={`/${lang}`} className="flex items-center space-x-4">
            <Image
              src="/assets/logo-dmd.svg"
              alt="DMD Logo"
              width={40}
              height={40}
              priority
            />
            <span
              className="font-bold text-white leading-tight"
              style={{ fontSize: "28px" }}
            >
              DMD ShoeParts
              <br />
              Manufacturing
            </span>
          </Link>
        </div>

        {/* Middle: Menu (centered with flex) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-8">
            {menu.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={`/${lang}${item.href}`}
                  className={`relative whitespace-nowrap transition-colors group ${
                    isActive
                      ? "font-semibold text-white"
                      : "font-semibold text-white/70 hover:text-white"
                  }`}
                  style={{
                    fontSize: "20px",
                    lineHeight: "154%",
                  }}
                >
                  {item.label}
                  {/* Underline Animation */}
                  {/* <span
                    className={`absolute left-0  h-[2px] bg-white transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span> */}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: LocaleSwitcher */}
        <div className="flex items-center">
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
