"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "../../../../../i18n-config";
import locales from "./LocaleList";

const buildHref = (pathname: string | null, locale: Locale) => {
  if (!pathname) {
    return `/${locale}`;
  }
  const segments = pathname.split("/");
  if (segments.length > 1) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }
  return `/${locale}`;
};

type LocaleSwitcherProps = {
  className?: string;
};

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentLocale = (pathname?.split("/")[1] as Locale) || "en";
  const active = locales.find((item) => item.code === currentLocale);

  const handleSelect = (locale: Locale) => {
    setOpen(false);
    router.push(buildHref(pathname, locale));
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <div className={clsx("relative inline-flex text-left", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="locale-menu"
      >
        <span className="[&>svg]:h-5 [&>svg]:w-5">{active?.flag}</span>
        <span className="uppercase">{active?.code}</span>
        <svg
          className={clsx(
            "h-3.5 w-3.5 text-current transition-transform duration-200",
            open && "rotate-180",
          )}
          viewBox="0 0 20 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 2 10 10 18 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id="locale-menu"
          ref={menuRef}
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg"
        >
          {locales.map(({ code, label, flag }) => {
            const isActive = code === currentLocale;
            return (
              <li key={code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(code as Locale)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    isActive
                      ? "bg-primary text-white"
                      : "text-neutral-900 hover:bg-neutral-100",
                  )}
                >
                  <span className="[&>svg]:h-5 [&>svg]:w-5">{flag}</span>
                  <span className="flex-1 truncate text-left">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
