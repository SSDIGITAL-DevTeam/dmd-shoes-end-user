import React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type LogoProps = {
  lang: string;
  showLabel?: boolean;
  className?: string;
  textClassName?: string;
  imageClassName?: string;
};

function Logo({
  lang,
  showLabel = false,
  className,
  textClassName,
  imageClassName,
}: LogoProps) {
  return (
    <Link
      href={`/${lang}`}
      className={clsx("inline-flex items-center gap-3", className)}
    >
      <Image
        src="/assets/logo-dmd.svg"
        alt="DMD ShoeParts Manufacturing"
        width={120}
        height={60}
        priority
        className={clsx("h-12 w-auto max-h-[3.75rem]", imageClassName)}
      />
      {showLabel ? (
        <span
          className={clsx(
            "text-sm font-semibold uppercase tracking-wide text-primary",
            textClassName,
          )}
        >
          DMD ShoeParts Manufacturing
        </span>
      ) : null}
    </Link>
  );
}

export default Logo;
