"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "../../../../../i18n-config";
import locales from "./localesList"

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentLocale = (pathname?.split("/")[1] as Locale) || "en";

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const handleSelect = (locale: Locale) => {
    setOpen(false);
    router.push(redirectedPathname(locale));
  };

  const activeLocale = locales.find((l) => l.code === currentLocale);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 bg-transparent px-3 py-2 text-white focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeLocale?.flag}
        <span className="text-base">{activeLocale?.code}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-[-140px] mt-2 min-w-[360px] rounded-2xl bg-white shadow-lg ring-1 ring-black/5 z-10 overflow-hidden space-y-3"
          style={{
            fontFamily: "Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
            lineHeight: "154%",
          }}
        >
          {locales.map(({ code, label, flag }) => (
            <li
              role="option"
              aria-selected={code === currentLocale}
              key={code}
              onClick={() => handleSelect(code)}
              className="flex items-center gap-3 px-6 py-6 text-[24px] font-normal text-black hover:bg-gray-100 cursor-pointer"
            >
              {flag}
              <span>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}