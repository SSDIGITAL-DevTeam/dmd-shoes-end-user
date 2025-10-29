import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, RUNTIME, safeJsonFetch, xml } from "../../../../lib/sitemap";
export const runtime = RUNTIME;

type Ctx = { params?: { lang?: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const lang = (LOCALES as readonly string[]).includes(ctx.params?.lang ?? "") ? ctx.params!.lang : "id";
  const products: any[] = (await safeJsonFetch(`${API_URL}/products`)) as any[];

  const urls = products.map(p => ({
    loc: `${ORIGIN}/${lang}/products/${p.slug}`,
    lastmod: fmtDate(p.updated_at),
    changefreq: "weekly",
    priority: 0.9,
  }));
  return new Response(buildUrlsetXML(urls), xml());
}
