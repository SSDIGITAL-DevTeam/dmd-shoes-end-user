import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, safeJsonFetch, xml } from "@/lib/sitemap";

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

  const articles = (await safeJsonFetch(`${API_URL}/articles`)) as any[] | null;
  const list = Array.isArray(articles) ? articles : [];

  const urls = list.map((a) => ({
    loc: `${ORIGIN}/${lang}/article/${a.slug}`,
    lastmod: fmtDate(a.updated_at),
    changefreq: "weekly" as const,
    priority: 0.8,
  }));

  return new Response(buildUrlsetXML(urls), xml());
}
