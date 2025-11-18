import {
  buildSitemapIndexXML,
  fmtDate,
  LOCALES,
  ORIGIN,
  resolveLocaleParam,
  xml,
} from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 1800;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

type LangRouteContext = { params: Promise<{ lang: string }> };

export async function GET(_req: Request, { params }: LangRouteContext) {
  const { lang: rawLang } = await params;
  const lang = resolveLocaleParam(rawLang);
  const items = [
    { loc: `${ORIGIN}/${lang}/article.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/product.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/pages.xml`, lastmod: fmtDate() },
  ];

  const body = buildSitemapIndexXML(items);
  return new Response(body, xml());
}
