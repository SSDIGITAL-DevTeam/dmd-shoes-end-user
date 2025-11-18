import {
  getProductEntries,
  renderSitemapXml,
  resolveLocaleParam,
  xmlHeaders,
} from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 1800;

type LangRouteContext = { params: Promise<{ lang: string }> };

export async function GET(_req: Request, { params }: LangRouteContext) {
  const { lang: rawLang } = await params;
  const lang = resolveLocaleParam(rawLang);
  const entries = await getProductEntries(lang);
  const xml = renderSitemapXml(entries);

  return new Response(xml, { headers: xmlHeaders() });
}
