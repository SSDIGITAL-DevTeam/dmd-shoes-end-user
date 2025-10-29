// app/[lang]/sitemap/articles.xml/route.ts
import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, safeJsonFetch, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

// ✅ Next.js 15: params wajib berupa Promise & harus di‐await
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await params; // <- wajib di-await
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  // NOTE: ini hanya ambil halaman pertama. Jika butuh semua artikel, tambahkan auto-paginate.
  const articles = (await safeJsonFetch(`${API_URL}/articles`)) as any[] | null;
  const list = Array.isArray(articles) ? articles : [];

  const urls = list.map((a) => ({
    // kalau slug bilingual: const slug = lang === "id" ? a.slug_id : a.slug_en;
    loc: `${ORIGIN}/${lang}/articles/${a.slug}`,
    lastmod: fmtDate(a.updated_at),
    changefreq: "weekly" as const,
    priority: 0.8,
  }));

  return new Response(buildUrlsetXML(urls), xml());
}
