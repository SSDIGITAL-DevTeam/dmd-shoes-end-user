// src/lib/localePath.ts
import { i18n } from "@/i18n-config";
export type Locale = (typeof i18n)["locales"][number];

const LOCALE_RE = new RegExp(`^/(${i18n.locales.join("|")})(?=/|$)`);

export function stripLang(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p.replace(LOCALE_RE, "") || "/";
}

export function withLang(lang: Locale, path: string): string {
  const clean = stripLang(path);
  return `/${lang}${clean}`;
}
