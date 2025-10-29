"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "../../../../../i18n-config";
import locales, { resolveLocaleLabel } from "./LocaleList";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // current locale from path: /{locale}/...
  const currentLocale = (pathname?.split("/")[1] as Locale) || "en";
  const active = locales.find((l) => l.code === currentLocale);

  // Close dropdown on route change, click outside, scroll, resize, or Esc
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  // Build path for another locale without creating /en/id/... chains
  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return `/${locale}`;
    const seg = pathname.split("/");
    seg[1] = locale;
    return seg.join("/");
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <span className="[&>svg]:w-5 [&>svg]:h-5">{active?.flag}</span>
        <span className="text-sm uppercase">{active?.code}</span>
        <svg
          viewBox="0 0 20 12"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 2l8 8 8-8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown (only when open) */}
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[240px] rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5"
        >
          {locales.map((item) => (
            <li key={item.code}>
              <a
                href={redirectedPathname(item.code)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-[14px] leading-6 text-gray-900 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <span className="[&>svg]:w-5 [&>svg]:h-5">{item.flag}</span>
                <span className="whitespace-nowrap">
                  {resolveLocaleLabel(item, currentLocale)}
                </span>
                {item.code === currentLocale && (
                  <span className="ml-auto text-xs text-gray-500">✓</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
