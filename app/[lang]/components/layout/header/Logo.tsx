import React from "react";
import Image from "next/image";
import Link from "next/link";

type LogoProps = { lang: string };

export default function Logo({ lang }: LogoProps) {
  return (
    <Link href={`/${lang}`} className="flex items-center gap-3">
      <Image
        src="/assets/logo-dmd-vector.svg"
        alt="DMD Logo"
        width={40}
        height={40}
        priority
        className="invert brightness-0"
        style={{ filter: "invert(1) brightness(2)" }}
      />
      <span className="font-bold text-white leading-tight text-[14px] md:text-[16px]">
        DMD ShoeParts
        <br />
        Manufacturing
      </span>
    </Link>
  );
}
