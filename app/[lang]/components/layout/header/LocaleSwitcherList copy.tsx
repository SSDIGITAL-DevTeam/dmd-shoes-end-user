"use client";

import React from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
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

type LocaleSwitcherListProps = {
  className?: string;
};

const LocaleSwitcherList: React.FC<LocaleSwitcherListProps> = ({
  className,
}) => {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] as Locale) || "en";

  return (
    <div className={clsx("space-y-2.5", className)}>
      {locales.map((locale) => {
        const href = buildHref(pathname, locale.code as Locale);
        const isActive = locale.code === currentLocale;

        return (
          <Link
            key={locale.code}
            href={href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isActive
                ? "bg-primary text-white"
                : "text-neutral-900 hover:bg-neutral-100",
            )}
          >
            <span className="[&>svg]:h-5 [&>svg]:w-5">{locale.flag}</span>
            <span className="flex-1 truncate">{locale.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default LocaleSwitcherList;
