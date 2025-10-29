// app/[lang]/sitemap/categories.xml/route.ts
import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, safeJsonFetch, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }   // ✅ Next 15 expects Promise
) {
  const { lang: rawLang } = await params;              // ✅ must await
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  // NOTE: backend biasanya paginate; kita pakai per_page besar.
  const categories = (await safeJsonFetch(`${API_URL}/categories?per_page=999`)) as any[] | null;
  const list = Array.isArray(categories) ? categories : [];

  const urls = list.map((c) => ({
    // Jika slug bilingual: const slug = lang === "id" ? c.slug_id : c.slug_en;
    loc: `${ORIGIN}/${lang}/category/${c.slug}`,
    lastmod: fmtDate(c.updated_at),
    changefreq: "weekly" as const,
    priority: 0.7,
  }));

  return new Response(buildUrlsetXML(urls), xml());
}
