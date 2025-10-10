"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import locales from "./LocaleList";

const LocaleSwitcherList: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-full rounded-lg bg-white p-1">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={`/${locale.code}${pathname}`}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-[14px] leading-6 text-[#121212] hover:bg-gray-100"
        >
          <span className="[&>svg]:w-5 [&>svg]:h-5">{locale.flag}</span>
          <span className="whitespace-nowrap">{locale.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default LocaleSwitcherList;
