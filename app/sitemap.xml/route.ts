import { buildSitemapIndexXML, fmtDate, LOCALES, ORIGIN, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET() {
  const items = LOCALES.map((locale) => ({
    loc: `${ORIGIN}/${locale}/sitemap.xml`,
    lastmod: fmtDate(),
  }));

  return new Response(buildSitemapIndexXML(items), xml());
}
