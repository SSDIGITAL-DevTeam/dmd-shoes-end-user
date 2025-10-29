// app/sitemap.xml/route.ts
import { buildSitemapIndexXML, fmtDate, ORIGIN, LOCALES, xml } from "@/lib/sitemap";

export const runtime = "nodejs";
export async function GET() {
  const items: Array<{ loc: string; lastmod: string }> = [];

  for (const lang of LOCALES) {
    items.push(
      { loc: `${ORIGIN}/${lang}/sitemap.xml`, lastmod: fmtDate() },
      { loc: `${ORIGIN}/${lang}/sitemaps/articles.xml`, lastmod: fmtDate() },
      { loc: `${ORIGIN}/${lang}/sitemaps/products.xml`, lastmod: fmtDate() },
      { loc: `${ORIGIN}/${lang}/sitemaps/categories.xml`, lastmod: fmtDate() },
      { loc: `${ORIGIN}/${lang}/sitemaps/pages.xml`, lastmod: fmtDate() },
    );
  }

  const xmlStr = buildSitemapIndexXML(items);
  return new Response(xmlStr, xml());
}
