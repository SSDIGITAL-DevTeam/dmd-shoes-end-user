import { buildSitemapIndexXML, fmtDate, LOCALES, ORIGIN, xml, RUNTIME } from "../../../../lib/sitemap";
export const runtime = "nodejs";

type Ctx = { params?: { lang?: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const lang = (LOCALES as readonly string[]).includes(ctx.params?.lang ?? "") ? ctx.params!.lang : "id";
  const items = [
    { loc: `${ORIGIN}/${lang}/articles-sitemap.xml`,   lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/products-sitemap.xml`,   lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/categories-sitemap.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${lang}/pages-sitemap.xml`,      lastmod: fmtDate() },
  ];
  return new Response(buildSitemapIndexXML(items), xml());
}
