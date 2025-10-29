import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, RUNTIME, safeJsonFetch, xml } from "../../../../lib/sitemap";
export const runtime = RUNTIME;

type Ctx = { params?: { lang?: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const lang = (LOCALES as readonly string[]).includes(ctx.params?.lang ?? "") ? ctx.params!.lang : "id";
  const articles: any[] = (await safeJsonFetch(`${API_URL}/articles?per_page=999`)) as any[];

  const urls = articles.map(a => ({
    loc: `${ORIGIN}/${lang}/articles/${a.slug}`,   // ganti ke slug_id/slug_en jika ada
    lastmod: fmtDate(a.updated_at),
    changefreq: "weekly",
    priority: 0.8,
  }));
  return new Response(buildUrlsetXML(urls), xml());
}
