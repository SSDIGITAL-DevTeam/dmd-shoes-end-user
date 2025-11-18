// app/sitemap.xml/route.ts
import {
  LOCALES,
  ORIGIN,
  renderSitemapIndex,
  xmlHeaders,
} from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();

  const xml = renderSitemapIndex(
    LOCALES.map((lang) => ({
      loc: `${ORIGIN}/${lang}/sitemap.xml`,
      lastmod: now,
    })),
  );

  return new Response(xml, { headers: xmlHeaders() });
}
