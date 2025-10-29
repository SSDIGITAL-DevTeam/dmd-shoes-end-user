"use client";

import React, { CSSProperties } from "react";

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
        mx-auto w-full max-w-[1200px] px-4 md:px-6
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}
