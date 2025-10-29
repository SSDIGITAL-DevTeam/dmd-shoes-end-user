// app/[lang]/sitemap_index.xml/route.ts
import { buildSitemapIndexXML, fmtDate, LOCALES, ORIGIN, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await params; // wajib di-await di Next 15
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  const items = [
    { loc: `${ORIGIN}/${lang}/articles-sitemap.xml`,   lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/products-sitemap.xml`,   lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/categories-sitemap.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/pages-sitemap.xml`,      lastmod: fmtDate() },
  ];

  return new Response(buildSitemapIndexXML(items), xml());
}
