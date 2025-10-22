// types/next.ts
import type React from "react";
import type { Locale } from "@/i18n-config";

/** ✅ Versi Promise (sesuai Next 15) */
export type LangParamsP = Promise<{ lang: Locale }>;
export type PagePropsP<P extends Promise<any>> = { params: P };
export type LayoutPropsP<P extends Promise<any>> = { children: React.ReactNode; params: P };

/** (Opsional) Versi non-Promise — JANGAN dipakai di entry page/layout */
export type LangParams = { lang: Locale };
export type PageProps<P = Record<string, never>> = { params: P };
export type LayoutProps<P = Record<string, never>> = { children: React.ReactNode; params: P };
