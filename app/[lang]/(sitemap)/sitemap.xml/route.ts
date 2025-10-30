import { buildSitemapIndexXML, fmtDate, LOCALES, ORIGIN, xml } from "@/lib/sitemap";

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

  const items = [
    { loc: `${ORIGIN}/${lang}/article.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/product.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/pages.xml`, lastmod: fmtDate() },
  ];

  return new Response(buildSitemapIndexXML(items), xml());
}
