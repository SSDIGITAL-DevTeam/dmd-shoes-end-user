// app/[lang]/sitemap/products.xml/route.ts
import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, safeJsonFetch, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await params;
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  const products = (await safeJsonFetch(`${API_URL}/products`)) as any[] | null;
  const list = Array.isArray(products) ? products : [];

  const urls = list.map((p) => ({
    loc: `${ORIGIN}/${lang}/product/${p.slug}`,
    lastmod: fmtDate(p.updated_at),
    changefreq: "weekly" as const,
    priority: 0.9,
  }));

  return new Response(buildUrlsetXML(urls), xml());
}
