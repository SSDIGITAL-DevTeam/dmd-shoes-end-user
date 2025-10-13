import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan class Tailwind dengan aman */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Konversi px → vw untuk layout fluid (default basis 1280px) */
export function pxToVw(px: number, base = 1280) {
  return `${(px / base) * 100}vw`;
}

/* ================================
   🎨 TEMPLATE FONT STYLES
   Mengikuti tabel di gambar:
   - Desktop | Tablet | Mobile
   - Line-height & letter-spacing
   ================================= */

export const fontStyles = {
  h1: cn(
    // base (mobile)
    "text-[1.5rem] font-bold leading-[1] tracking-[-0.0625rem]",
    // tablet ≥640px
    "sm:text-[2.125rem]",
    // desktop ≥1024px
    "lg:text-[2.375rem]"
  ),
  h2: cn(
    "text-[1.125rem] font-bold leading-[1.067] tracking-[-0.05rem]",
    "sm:text-[1.5rem]",
    "lg:text-[1.875rem]"
  ),
  h3: cn(
    "text-[1.25rem] font-bold leading-[1.083] tracking-[-0.0375rem]",
    "sm:text-[1.25rem]",
    "lg:text-[1.5rem]"
  ),
  h4: cn(
    "text-[1.125rem] font-bold leading-[1.1] tracking-[-0.025rem]",
    "sm:text-[1.125rem]",
    "lg:text-[1.25rem]"
  ),
  h5: cn(
    "text-[1rem] font-bold leading-[1.111] tracking-[-0.0125rem]",
    "sm:text-[1rem]",
    "lg:text-[1.125rem]"
  ),
  h6: cn(
    "text-[1rem] font-bold leading-[1.125] tracking-[-0.00625rem]"
  ),

  paragraph: {
    sm: "text-[1.25rem] leading-[1.4] text-slate-600",
    base: "text-[1.25rem] leading-[1.4] text-slate-700",
    lg: "text-[1.25rem] leading-[1.4] text-slate-700",
  },
};