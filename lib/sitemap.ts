// lib/sitemap.ts
export const RUNTIME = "nodejs";
export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.dmdshoeparts.com"
    : "http://localhost:3000");

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dmdshoeparts.com/api/v1";

export function xml(headers = {}) {
  return {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      ...headers,
    },
  } as const;
}
export function fmtDate(d?: string | number | Date) {
  try { return new Date(d || Date.now()).toISOString(); } catch { return new Date().toISOString(); }
}
export async function safeJsonFetch<T = any>(url: string, ms = 6000): Promise<T | []> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      // ⬇️ matikan cache Next untuk fetch ini
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) return [];
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return [];
    const data = (await res.json()) as any;
    return (data?.data as T) ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}
function esc(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
export function buildSitemapIndexXML(items: Array<{ loc: string; lastmod?: string }>) {
  const body = items.map(i => `<sitemap><loc>${esc(i.loc)}</loc>${i.lastmod?`<lastmod>${esc(i.lastmod)}</lastmod>`:""}</sitemap>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>`+
         `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}
export function buildUrlsetXML(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  const body = urls.map(u =>
    `<url><loc>${esc(u.loc)}</loc>`+
    (u.lastmod?`<lastmod>${esc(u.lastmod)}</lastmod>`:"")+
    (u.changefreq?`<changefreq>${esc(u.changefreq)}</changefreq>`:"")+
    (typeof u.priority==="number"?`<priority>${u.priority}</priority>`:"")+
    `</url>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>`+
         `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}
