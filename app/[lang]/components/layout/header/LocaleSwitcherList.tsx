"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import locales, { resolveLocaleLabel, LocaleItem } from "./LocaleList";
import type { Locale } from "../../../../../i18n-config";

type Props = {
  uiLocale?: Locale;    // bahasa UI untuk label
  withTitle?: boolean;
  title?: string;       // "Bahasa" / "Language"
};

const LocaleSwitcherList: React.FC<Props> = ({
  uiLocale = "en",
  withTitle = false,
  title,
}) => {
  const pathname = usePathname() || "/";
  // bersihkan prefix locale agar tidak /en/id/...
  const cleaned = pathname.replace(/^\/(id|en)(?=\/|$)/, "") || "/";

  return (
    <div className="w-full rounded-lg bg-white p-1">
      {withTitle && title ? (
        <div className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {title}
        </div>
      ) : null}

      {locales.map((locale: LocaleItem) => (
        <Link
          key={locale.code}
          href={`/${locale.code}${cleaned}`}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-[14px] leading-6 text-[#121212] hover:bg-gray-100"
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">{locale.flag}</span>
          <span className="whitespace-nowrap">
            {resolveLocaleLabel(locale, uiLocale)}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default LocaleSwitcherList;
