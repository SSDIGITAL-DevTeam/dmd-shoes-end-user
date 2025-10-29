import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, RUNTIME, safeJsonFetch, xml } from "../../../../lib/sitemap";
export const runtime = "nodejs";

type Ctx = { params?: { lang?: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const lang = (LOCALES as readonly string[]).includes(ctx.params?.lang ?? "") ? ctx.params!.lang : "id";
  const categories: any[] = (await safeJsonFetch(`${API_URL}/categories?per_page=999`)) as any[];

  const urls = categories.map(c => ({
    loc: `${ORIGIN}/${lang}/category/${c.slug}`,
    lastmod: fmtDate(c.updated_at),
    changefreq: "weekly",
    priority: 0.7,
  }));
  return new Response(buildUrlsetXML(urls), xml());
}
