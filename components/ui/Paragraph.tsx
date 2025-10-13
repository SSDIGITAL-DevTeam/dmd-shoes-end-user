"use client";
import { cn, fontStyles } from "@/lib/utils";

type ParagraphProps = {
  size?: "sm"|"base"|"lg";
  children: React.ReactNode;
  className?: string;
};

export default function Paragraph({ size="base", children, className }:ParagraphProps) {
  return <p className={cn(fontStyles.paragraph[size], className)}>{children}</p>;
}