import {
  getProductEntries,
  renderSitemapXml,
  xmlHeaders,
  type Locale,
} from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 1800;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: Locale }> },
) {
  const { lang } = await params;

  const entries = await getProductEntries(lang);
  const xml = renderSitemapXml(entries);

  return new Response(xml, { headers: xmlHeaders() });
}
