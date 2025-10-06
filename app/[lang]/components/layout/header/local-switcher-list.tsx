"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import locales from "./localesList";

const LocaleSwitcherList: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 bg-white  rounded-lg  w-full">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={`/${locale.code}${pathname}`}
          className="flex items-center gap-2 px-3 py-2 rounded
           hover:bg-gray-100 text-[#121212]
           text-[16]  leading-[154%]"
        >
          {locale.flag}
          <span>{locale.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default LocaleSwitcherList;
