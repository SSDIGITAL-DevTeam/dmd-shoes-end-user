import {
  getStaticPageEntries,
  renderSitemapXml,
  xmlHeaders,
  type Locale,
} from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 1800;

export async function GET(
  _req: Request,
  { params }: { params: { lang: Locale } },
) {
  const entries = await getStaticPageEntries(params.lang);
  const xml = renderSitemapXml(entries);
  return new Response(xml, { headers: xmlHeaders() });
}
