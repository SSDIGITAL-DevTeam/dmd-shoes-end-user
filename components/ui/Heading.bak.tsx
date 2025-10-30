"use client";
import { cn, fontStyles } from "@/lib/utils";

type HeadingProps = {
  as?: "h1"|"h2"|"h3"|"h4"|"h5"|"h6";
  children: React.ReactNode;
  className?: string;
};

export default function Heading({ as:Tag="h1", children, className }:HeadingProps) {
  return <Tag className={cn(fontStyles[Tag], className)}>{children}</Tag>;
}