"use client";
import React, { useState, useRef, useEffect } from "react";
import LocaleSwitcher from "./locale-switcher";
import LocaleSwitcherList from "./local-switcher-list";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { HiMenu } from "react-icons/hi";
import { getDictionary } from "../../../../../dictionaries/get-dictionary";
import Link from "next/link";
import { FaUserAlt, FaRegHeart } from "react-icons/fa";
import Logo from "./Logo";
import { useAuthStore } from "@/store/auth-store";

const AUTH_FALLBACK_LABELS: Record<
  string,
  { register: string; login: string; wishlist: string; account: string }
> = {
  id: {
    register: "Daftar",
    login: "Masuk",
    wishlist: "Favorit",
    account: "Akun",
  },
  en: {
    register: "Register",
    login: "Log In",
    wishlist: "Wishlist",
    account: "Account",
  },
};

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
  const { token, user, isHydrated } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    isHydrated: state.isHydrated,
  }));

  useEffect(() => {
    if (navRef.current) {
      // gunakan getBoundingClientRect untuk hasil lebih stabil di mobile
      const h = navRef.current.getBoundingClientRect().height || 0;
      setNavHeight(h);
    }
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const currentPath = "/" + (segments[1] ?? "");
  const isAuthenticated = Boolean(token && user);
  const showGuestView = isHydrated ? !isAuthenticated : true;

  const menu = [
    { label: dictionary.menu.home, href: "/" },
    { label: dictionary.menu.products, href: "/product" },
    { label: dictionary.menu.articles, href: "/article" },
    { label: dictionary.menu.about_us, href: "/about" },
    { label: dictionary.menu.contact_us, href: "/contact" },
  ];

  const fallbackAuth = AUTH_FALLBACK_LABELS[lang] ?? AUTH_FALLBACK_LABELS.en;
  const dictionaryAuth = dictionary.auth ?? {};
  const dictionaryHomeAuth =
    (dictionary as {
      home?: { auth?: Partial<typeof fallbackAuth> };
    }).home?.auth ?? {};
  const authLabels = {
    register:
      dictionaryAuth.register ??
      dictionaryHomeAuth.register ??
      fallbackAuth.register,
    login:
      dictionaryAuth.login ??
      dictionaryHomeAuth.login ??
      fallbackAuth.login,
    wishlist:
      dictionaryAuth.wishlist ??
      dictionaryHomeAuth.wishlist ??
      fallbackAuth.wishlist,
    account:
      dictionaryAuth.account ??
      dictionaryHomeAuth.account ??
      fallbackAuth.account,
  };

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
          {/* Mobile: Hamburger kiri + Logo tengah */}
          <div className="flex items-center justify-between w-full lg:hidden">
            {/* Hamburger kiri */}
            <button
              className="text-white text-3xl"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <HiMenu aria-hidden="true" />
            </button>

            {/* Logo tengah */}
            <Logo lang={lang} />

            {/* Auth actions kanan */}
            <div className="flex items-center justify-end gap-3 text-white">
              {showGuestView ? (
                <>
                  <Link
                    href={`/${lang}/auth/register`}
                    className="px-[10px] py-[6px] text-sm font-medium border border-white"
                  >
                    {authLabels.register}
                  </Link>
                  <Link
                    className="px-[10px] py-[6px] text-sm font-medium border border-white bg-white text-primary"
                    href={`/${lang}/auth/login`}
                  >
                    {authLabels.login}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={`/${lang}/wishlist`}
                    className="w-8 text-white"
                    aria-label="Wishlist"
                  >
                    <FaRegHeart size={28} aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/${lang}/profile`}
                    className="w-8 text-white"
                    aria-label="Profile"
                  >
                    <FaUserAlt size={28} aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop: Logo kiri */}
          <div className="hidden lg:flex items-center space-x-4">
            <Logo lang={lang} />
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
                    className={`relative whitespace-nowrap transition-colors group ${isActive
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
            {showGuestView ? (
              <>
                <Link
                  href={`/${lang}/auth/register`}
                  className="px-[16px] py-[10px] text-[20px] text-white font-medium border border-white"
                >
                  {authLabels.register}
                </Link>

                <Link
                  className="px-[16px] py-[10px] text-[20px] font-medium border border-white bg-white text-primary"
                  href={`/${lang}/auth/login`}
                >
                  {authLabels.login}
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4 text-white">
                <Link
                  href={`/${lang}/wishlist`}
                  className="px-[10px] py-[16px] text-[16px] text-white font-medium hover:underline flex items-center gap-2"
                >
                  <FaRegHeart size={24} aria-hidden="true" />
                    <span>{authLabels.wishlist}</span>
                  </Link>

                <Link
                  href={`/${lang}/profile`}
                  className="px-[10px] py-[16px] text-[16px] text-white font-medium hover:underline flex items-center gap-2"
                >
                  <FaUserAlt size={24} aria-hidden="true" />
                    <span>{authLabels.account}</span>
                  </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer biar konten tidak ketimpa navbar */}
      <div style={{ height: Math.max(0, navHeight - 1) }} />

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
          duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } w-full max-w-[250px] flex flex-col`}
        style={{
          top: navHeight,
          height: `calc(100% - ${navHeight}px)`,
        }}
      >
        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto pb-6">
          {menu.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className={`block px-[25px] py-[27px] font-medium ${isActive
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
            {showGuestView ? (
              <>
                <Link
                  href={`/${lang}/auth/register`}
                  className="px-4 py-3 text-[16px] leading-[22px] font-medium text-primary border border-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {authLabels.register}
                </Link>
                <Link
                  href={`/${lang}/auth/login`}
                  className="px-4 py-3 text-[16px] leading-[22px] font-medium border border-primary bg-primary text-white text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {authLabels.login}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4 text-primary text-[24px]">
                <Link
                  href={`/${lang}/wishlist`}
                  className="px-[10px] py-[16px]"
                  onClick={() => setIsOpen(false)}
                >
                  <FaRegHeart size={24} aria-hidden="true" />
                    <span>{authLabels.wishlist}</span>
                  </Link>
                <Link
                  href={`/${lang}/profile`}
                  className="px-[10px] py-[16px]"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserAlt size={24} aria-hidden="true" />
                    <span>{authLabels.account}</span>
                  </Link>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-t-[#121212]/25  px-[25px]">
            <LocaleSwitcherList />
          </div>
        </div>
      </div>
    </>
  );
}




