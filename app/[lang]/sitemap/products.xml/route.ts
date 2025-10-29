// app/[lang]/sitemap/products.xml/route.ts
import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, safeJsonFetch, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

// ✅ Next.js 15: params adalah Promise dan HARUS di-await
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await params; // wajib di-await
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  // Ambil list produk (gunakan per_page besar agar semua produk diambil)
  const products = (await safeJsonFetch(`${API_URL}/products`)) as any[] | null;
  const list = Array.isArray(products) ? products : [];

  const urls = list.map((p) => {
    // kalau slug bilingual: const slug = lang === "id" ? p.slug_id : p.slug_en;
    const slug = p.slug;
    return {
      loc: `${ORIGIN}/${lang}/product/${slug}`, // 🟢 ubah dari /products/ ke /product/
      lastmod: fmtDate(p.updated_at),
      changefreq: "weekly" as const,
      priority: 0.9,
    };
  });

  return new Response(buildUrlsetXML(urls), xml());
}
