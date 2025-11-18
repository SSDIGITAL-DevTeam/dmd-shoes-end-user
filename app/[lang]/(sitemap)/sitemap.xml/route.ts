import {
  buildSitemapIndexXML,
  fmtDate,
  LOCALES,
  ORIGIN,
  xml,
  type Locale,
} from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 1800;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: Locale }> },
) {
  // ✅ params di-await dulu
  const { lang: rawLang } = await params;

  const lang: Locale = LOCALES.includes(rawLang) ? rawLang : "id";

  const items = [
    { loc: `${ORIGIN}/${lang}/article.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/product.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/pages.xml`, lastmod: fmtDate() },
  ];

  const body = buildSitemapIndexXML(items);
  return new Response(body, xml());
}
