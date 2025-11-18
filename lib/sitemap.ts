// src/lib/seo/sitemap.ts (DMD version)

import path from "node:path";
import { promises as fs } from "node:fs";

export type Locale = "id" | "en";
export const LOCALES: Locale[] = ["id", "en"];

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as ReadonlyArray<string>).includes(value)
  );
}

export function resolveLocaleParam(value: string | null | undefined): Locale {
  return isLocale(value) ? value : LOCALES[0];
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.dmdshoeparts.com";

export const ORIGIN = SITE_URL;

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://api.dmdshoeparts.com/api/v1";

const DEFAULT_LASTMOD = new Date().toISOString();
const MAX_URLS_PER_SITEMAP = 10_000;

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

type PaginatedResponse<T> = {
  data?: T[];
  pagination?: {
    page?: number;
    totalPages?: number;
  };
  meta?: {
    current_page?: number;
    last_page?: number;
  };
};

const PROJECT_ROOT = path.join(process.cwd());

/**
 * Static pages DMD – isi path tanpa prefix /{lang}
 * Nanti di-join dengan lang di getStaticPageEntries()
 */
const STATIC_PAGES: Array<{
  path: string;
  file: string;
  priority?: number;
}> = [
  { path: "", file: "src/app/(site)/[lang]/page.tsx", priority: 0.9 }, // /id, /en
  {
    path: "about",
    file: "src/app/(site)/[lang]/about/page.tsx",
    priority: 0.7,
  },
  {
    path: "contact",
    file: "src/app/(site)/[lang]/contact/page.tsx",
    priority: 0.6,
  },
  {
    path: "product",
    file: "src/app/(site)/[lang]/product/page.tsx",
    priority: 0.8,
  },
  {
    path: "article",
    file: "src/app/(site)/[lang]/article/page.tsx",
    priority: 0.7,
  },
  // tambahkan static page lain di sini kalau ada
];

const toAbsoluteUrl = (slug: string) => {
  if (!slug) return SITE_URL;
  const normalized = slug.startsWith("/") ? slug : `/${slug}`;
  return `${SITE_URL}${normalized}`
    .replace(/(?<!:)\/{2,}/g, "/")
    .replace("https:/", "https://");
};

const toIsoString = (value?: string | Date | null) => {
  if (!value) return DEFAULT_LASTMOD;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return DEFAULT_LASTMOD;
  return date.toISOString();
};

// kompatibel dengan fmtDate lama
export function fmtDate(value?: string | Date | null) {
  return toIsoString(value);
}

async function getFileTimestamp(relativePath: string) {
  try {
    const filePath = path.join(PROJECT_ROOT, relativePath);
    const stats = await fs.stat(filePath);
    return stats.mtime.toISOString();
  } catch {
    return DEFAULT_LASTMOD;
  }
}

async function fetchJson<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T | null> {
  if (!API_URL) return null;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  const url = `${API_URL}${endpoint}${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  return (await response.json()) as T;
}

/**
 * Fetch paginated dengan dukungan struktur Laravel / custom
 */
async function fetchPaginatedCollection<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const results: T[] = [];
  let nextPage = 1;
  const limit = Number(params.limit ?? 100);

  while (results.length < MAX_URLS_PER_SITEMAP) {
    const payload = await fetchJson<PaginatedResponse<T>>(endpoint, {
      ...params,
      page: nextPage,
      limit,
    });

    if (!payload) break;

    const chunk = payload.data ?? [];
    results.push(...chunk);

    // dukung dua gaya pagination (pagination / meta)
    const p = payload.pagination;
    const m = payload.meta;

    const totalPages = p?.totalPages ?? m?.last_page;
    const currentPage = p?.page ?? m?.current_page ?? nextPage;

    if (!totalPages || currentPage >= totalPages) break;

    nextPage = currentPage + 1;
  }

  return results.slice(0, MAX_URLS_PER_SITEMAP);
}

/**
 * STATIC PAGES – per-locale
 */
export async function getStaticPageEntries(
  lang: Locale,
): Promise<SitemapEntry[]> {
  return Promise.all(
    STATIC_PAGES.map(async ({ path, file, priority }) => {
      // ganti placeholder [lang] di path file
      const filePath = file.replace("[lang]", lang);

      const slug =
        path === ""
          ? `/${lang}`
          : `/${lang}/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;

      return {
        loc: toAbsoluteUrl(slug),
        lastmod: await getFileTimestamp(filePath),
        changefreq: "monthly" as const,
        priority,
      };
    }),
  );
}

/**
 * ARTICLES – /{lang}/article/[slug]
 */
type DmdArticle = {
  slug: string;
  updated_at?: string;
  created_at?: string;
};

export async function getArticleEntries(
  lang: Locale,
): Promise<SitemapEntry[]> {
  const articles =
    (await fetchPaginatedCollection<DmdArticle>("/articles", {
      lang,
      status: "Published",
      limit: 100,
    })) ?? [];

  return articles.map((article) => ({
    loc: toAbsoluteUrl(`${lang}/article/${article.slug}`),
    lastmod: toIsoString(article.updated_at ?? article.created_at),
    changefreq: "weekly",
    priority: 0.8,
  }));
}

/**
 * PRODUCTS – /{lang}/product/[slug]
 */
type DmdProduct = {
  slug: string;
  updated_at?: string;
  created_at?: string;
};

export async function getProductEntries(
  lang: Locale,
): Promise<SitemapEntry[]> {
  const products =
    (await fetchPaginatedCollection<DmdProduct>("/products", {
      // kalau backend-mu terima lang juga, boleh tambahkan:
      // lang,
      status: "Active",
      limit: 200,
    })) ?? [];

  return products.map((product) => ({
    loc: toAbsoluteUrl(`/${lang}/product/${product.slug}`),
    lastmod: toIsoString(product.updated_at ?? product.created_at),
    changefreq: "weekly",
    priority: 0.7,
  }));
}

/**
 * Kalau kamu punya kategori artikel / kategori produk, bisa mirip getDynamicEntries()
 * Untuk sekarang bisa dikosongkan atau dihapus.
 */
export async function getDynamicEntries(
  _lang: Locale,
): Promise<SitemapEntry[]> {
  return [];
}

/**
 * <urlset> – TANPA xml-stylesheet (tidak pakai XSL)
 */
export function renderSitemapXml(urls: SitemapEntry[]) {
  const items = urls
    .map(
      (url) => `<url>
  <loc>${url.loc}</loc>
  ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
  ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
  ${
    typeof url.priority === "number"
      ? `<priority>${url.priority.toFixed(1)}</priority>`
      : ""
  }
</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

/**
 * <sitemapindex> – untuk index per-locale atau per-child (pages/articles/products)
 */
export function renderSitemapIndex(
  items: Array<{ loc: string; lastmod?: string }>,
) {
  const body = items
    .map(
      (item) => `<sitemap>
  <loc>${item.loc}</loc>
  ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}
</sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

/**
 * Endpoint yang kamu punya per-locale: /{lang}/pages.xml, /{lang}/article.xml, /{lang}/product.xml
 */
export const SITEMAP_ENDPOINTS = [
  "pages",
  "article",
  "product",
  // tambah "dynamic" kalau nanti dipakai
] as const;

export function xmlHeaders() {
  return {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };
}

// kompatibel dengan helper lama xml()
export function xml(extraHeaders: Record<string, string> = {}) {
  return {
    headers: {
      ...xmlHeaders(),
      ...extraHeaders,
    },
  };
}

/**
 * Helper kalau mau generate link child sitemap dari /{lang}/sitemap.xml
 */
export function getChildSitemapUrl(
  lang: Locale,
  slug: (typeof SITEMAP_ENDPOINTS)[number],
) {
  return `${SITE_URL}/${lang}/${slug}.xml`;
}

// kompatibel dengan nama helper lama
export function buildSitemapIndexXML(
  items: Array<{ loc: string; lastmod?: string }>,
) {
  return renderSitemapIndex(items);
}

export function buildUrlsetXML(urls: SitemapEntry[]) {
  return renderSitemapXml(urls);
}
