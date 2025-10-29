// lib/sitemap.ts
import { cookies } from "next/headers";

export const RUNTIME = "nodejs" as const;
export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://www.dmdshoeparts.com" : "http://localhost:3000");

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
export const TOKEN_COOKIE_NAME = "token";

// ---------- XML helpers ----------
function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
export function fmtDate(d?: string | number | Date) {
  try { return new Date(d || Date.now()).toISOString(); } catch { return new Date().toISOString(); }
}
export function xmlHeaders(extra?: Record<string, string>) {
  return {
    "content-type": "application/xml; charset=utf-8",
    "Cache-Control": "no-store",
    ...extra,
  };
}
const XSL = "/sitemap.xsl"; // kalau pakai stylesheet
export function urlsetXML(urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  const body = urls.map(u =>
    `<url><loc>${esc(u.loc)}</loc>` +
    (u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : "") +
    (u.changefreq ? `<changefreq>${esc(u.changefreq)}</changefreq>` : "") +
    (typeof u.priority === "number" ? `<priority>${u.priority}</priority>` : "") +
    `</url>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>` +
         `<?xml-stylesheet type="text/xsl" href="${XSL}"?>` +
         `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}
export function indexXML(items: Array<{ loc: string; lastmod?: string }>) {
  const body = items.map(i =>
    `<sitemap><loc>${esc(i.loc)}</loc>` +
    (i.lastmod ? `<lastmod>${esc(i.lastmod)}</lastmod>` : "") +
    `</sitemap>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>` +
         `<?xml-stylesheet type="text/xsl" href="${XSL}"?>` +
         `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}

// ---------- fetch helpers (format proxy: header/cookie/token, no-store) ----------
type Envelope<T> = { data?: T[]; meta?: { current_page: number; last_page: number } } | T[];

async function buildAuthHeaders(request?: Request) {
  const cookieHeader = request?.headers.get("cookie") ?? "";
  const authHeader = request?.headers.get("authorization") ?? "";
  const jar = await cookies();
  const tokenFromCookie = jar.get(TOKEN_COOKIE_NAME)?.value ?? null;

  const bearer =
    authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader
      : tokenFromCookie
        ? `Bearer ${tokenFromCookie}`
        : "";

  return {
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...(bearer ? { Authorization: bearer } : {}),
  };
}

export async function fetchJson<T = any>(url: string, request?: Request): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(await buildAuthHeaders(request)),
      },
      cache: "no-store",
      credentials: "include",
    });
    if (!upstream.ok) return null;
    const ct = upstream.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return null;
    return (await upstream.json()) as T;
  } catch {
    return null;
  }
}

// auto-paginate: GET /resource?page=N&per_page=M
export async function fetchAll<T = any>(baseUrl: string, request?: Request, perPage = 100) {
  const all: any[] = [];
  const first = await fetchJson<Envelope<T>>(`${baseUrl}?per_page=${perPage}&page=1`, request);
  if (!first) return all;

  const page1 = Array.isArray(first) ? first : (first.data ?? []);
  all.push(...page1);
  const last = Array.isArray(first) ? 1 : (first.meta?.last_page ?? 1);

  for (let p = 2; p <= last; p++) {
    const pg = await fetchJson<Envelope<T>>(`${baseUrl}?per_page=${perPage}&page=${p}`, request);
    const items = Array.isArray(pg) ? (pg ?? []) : (pg?.data ?? []);
    all.push(...items);
  }
  return all;
}
