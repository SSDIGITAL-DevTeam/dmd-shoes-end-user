"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "../../../../../i18n-config";
import locales from "./LocaleList";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const currentLocale = (pathname?.split("/")[1] as Locale) || "en";
  const active = locales.find((l) => l.code === currentLocale);

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const seg = pathname.split("/");
    seg[1] = locale;
    return seg.join("/");
  };

  const handleSelect = (locale: Locale) => {
    setOpen(false);
    router.push(redirectedPathname(locale));
  };

  // close on click outside / Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (open && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger (kecil) */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="locale-menu"
      >
        {/* kecilkan flag & teks */}
        <span className="[&>svg]:w-5 [&>svg]:h-5">{active?.flag}</span>
        <span className="text-sm uppercase">{active?.code}</span>
        <span
          className={`ml-1 inline-flex items-center justify-center text-white ${open ? "rotate-180" : ""
            } transition-transform duration-200`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 12"
            className="h-3.5 w-3.5"
            fill="none"
          >
            <path
              d="M2 2l8 8 8-8"
              stroke="currentColor"       // ikut warna teks -> putih di navbar biru
              strokeWidth="3"            // tebal seperti contoh
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

      </button>

      {/* Dropdown (compact) */}
      {open && (
        <ul
          id="locale-menu"
          ref={menuRef}
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[280px] rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5"
        >
          {locales.map(({ code, label, flag }) => (
            <li
              key={code}
              role="option"
              aria-selected={code === currentLocale}
              onClick={() => handleSelect(code)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-[14px] leading-6 text-gray-900 hover:bg-gray-100"
            >
              <span className="[&>svg]:w-4.5 [&>svg]:h-4.5">{flag}</span>
              <span className="whitespace-nowrap max-w-[220px] md:max-w-none truncate">{label}</span>
              {code === currentLocale && (
                <span className="ml-auto text-xs text-gray-500">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
