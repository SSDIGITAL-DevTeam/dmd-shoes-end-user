// app/[lang]/sitemap/pages.xml/route.ts
import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, safeJsonFetch, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }   // ✅ Next 15 expects Promise
) {
  const { lang: rawLang } = await params;              // ✅ must await
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  // Halaman statis per-locale
  const staticPages = ["", "about", "contact"].map((p) => ({
    loc: `${ORIGIN}/${lang}/${p}`.replace(/\/$/, ""),
    lastmod: fmtDate(),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  // Meta pages dari backend (privacy, terms, dsb)
  const metaPages = (await safeJsonFetch(`${API_URL}/meta/pages`)) as any[] | null;
  const metaList = Array.isArray(metaPages) ? metaPages : [];

  const metaUrls = metaList.map((m) => ({
    loc: `${ORIGIN}/${lang}/${m.slug}`,
    lastmod: fmtDate(m.updated_at),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  return new Response(buildUrlsetXML([...staticPages, ...metaUrls]), xml());
}
