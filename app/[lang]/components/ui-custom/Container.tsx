"use client";

import React, { CSSProperties } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function Container({
  children,
  className = "",
  style,
}: ContainerProps) {
  return (
    <div
      className={`
        mx-auto w-full px-4
        max-w-3xl sm:max-w-4xl md:max-w-5xl

        lg:max-w-7xl mx-auto   justify-between
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}
