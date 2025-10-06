"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import LocaleSwitcher from "./locale-switcher";
import LocaleSwitcherList from "./local-switcher-list";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { HiMenu, HiX } from "react-icons/hi";
import { getDictionary } from "../../../../../dictionaries/get-dictionary";
import Link from "next/link";
import { FaUserAlt, FaRegHeart } from "react-icons/fa";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const currentPath = "/" + (segments[1] ?? "");

  const menu = [
    { label: dictionary.menu.home, href: "/" },
    { label: dictionary.menu.products, href: "/product" },
    { label: dictionary.menu.articles, href: "/article" },
    { label: dictionary.menu.about_us, href: "/about" },
    { label: dictionary.menu.contact_us, href: "/contact" },
  ];
  

  return (
    <>
      {/* Navbar Fixed */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full bg-primary p-6 z-50"
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between ${poppins.className}`}
        >
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center">
            {/* Mobile Hamburger */}
            <button
                className="lg:hidden text-white text-3xl mr-4"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <HiMenu />
              </button>
            <Link href={`/${lang}`} className="flex items-center space-x-4">
              <Image
                src="/assets/logo-dmd.svg"
                alt="DMD Logo"
                width={54}
                height={54}
                priority
              />
              <span
                className="font-bold text-white leading-tight text-[24px]"

              >
                DMD ShoeParts
                <br />
                Manufacturing
              </span>
            </Link>
          </div>

          {/* Middle: Menu (desktop only) */}
          <div className="hidden lg:flex flex-1 justify-center">
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
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: LocaleSwitcher + Auth (desktop only) */}
          <div className="hidden lg:flex items-center space-x-4">
            <LocaleSwitcher />
       
            <Link
              href={`/${lang}/auth/register`}
              className="px-[16px] py-[10px] text-[20px] text-white font-medium border border-white"
            >
              Daftar
            </Link>

          
         
            <Link
              className="px-[16px] py-[10px] text-[20px] font-medium border border-white bg-white text-primary"
              href={`/${lang}/auth/login`}
            >
              Masuk
            </Link>
          </div>
          {/* need login */}
          <div className="hidden flex items-center space-x-4">
                {/* fav */}
                <Link
                  href={`/${lang}/wishlist`}
                  className="px-[10px] py-[16px] text-[24px] text-white font-medium "
                >
                    < FaRegHeart size={24} />
                </Link>

                <Link
                  href={`/${lang}/profile`}
                  className="px-[10px] py-[16px] text-[24px] text-white font-medium "
                >
                    < FaUserAlt size={24} />
                </Link>

                

                
          </div>
          
        </div>
      </nav>

      {/* Spacer biar konten tidak ketimpa navbar */}
      <div style={{ height: navHeight }} />

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed left-0 bg-white z-50 
          transform transition-transform 
          duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-full max-w-[250px] flex flex-col`}
        style={{
          top: `${navHeight}px`,
          height: `calc(100% - ${navHeight}px)`,
        }}
      >
        {/* Close Button */}
     

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto  pb-6">
          {menu.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className={`block px-[25px] py-[27px] font-medium ${
                  isActive
                    ? "text-primary"
                    : "text-primary hover:text-primary/80"
                }`}
                style={{
                  fontSize: "16px",
                  lineHeight: "22px",
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Auth Buttons */}
          <div className="flex flex-col gap-4 mt-6 px-[25px]">
            <Link
              href={`/${lang}/auth/register`}
              className="px-4 py-3 text-[16px] leading-[22px] font-medium text-primary border border-primary text-center"
              onClick={() => setIsOpen(false)}
            >
              Daftar
            </Link>
            <Link
              href={`/${lang}/auth/login`}
              className="px-4 py-3 text-[16px] leading-[22px] font-medium border border-primary bg-primary text-white text-center"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Link>
          </div>

          <div className="mt-6 border-t border-t-[#121212]/25  px-[25px]">
            <LocaleSwitcherList />
          </div>
        </div>
      </div>
    </>
  );
}
