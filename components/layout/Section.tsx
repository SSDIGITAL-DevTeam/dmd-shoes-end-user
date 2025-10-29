import clsx from "clsx";
import React from "react";

type Size = "dense" | "normal" | "relaxed";

const SIZE_MAP: Record<Size, string> = {
  dense: "py-2.5 sm:py-4 lg:py-6",
  normal: "py-3.5 sm:py-5 lg:py-7",
  relaxed: "py-4 sm:py-6 lg:py-10",
};

export default function Section({
  children,
  className,
  bg,
  size = "dense",
}: {
  children: React.ReactNode;
  className?: string;
  bg?: string;
  size?: Size;
}) {
  return <section className={clsx(bg, SIZE_MAP[size], className)}>{children}</section>;
}
