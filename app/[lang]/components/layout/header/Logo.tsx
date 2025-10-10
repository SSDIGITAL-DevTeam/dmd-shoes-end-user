import React from "react";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  lang: string;
};

function Logo({ lang }: LogoProps) {
  return (
    <Link href={`/${lang}`} className="flex items-center space-x-4">
      <Image
        src="/assets/logo-dmd.svg"
        alt="DMD Logo"
        width={50}
        height={50}
        priority
      />
      <span className="font-bold text-white leading-tight text-[16px]">
        DMD ShoeParts
        <br />
        Manufacturing
      </span>
    </Link>
  );
}

export default Logo;
