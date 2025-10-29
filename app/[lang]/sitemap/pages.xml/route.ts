import { API_URL, buildUrlsetXML, fmtDate, LOCALES, ORIGIN, RUNTIME, safeJsonFetch, xml } from "../../../../lib/sitemap";
export const runtime = "nodejs";

type Ctx = { params?: { lang?: string } };

export async function GET(_req: Request, ctx: Ctx) {
  const lang = (LOCALES as readonly string[]).includes(ctx.params?.lang ?? "") ? ctx.params!.lang : "id";

  const staticPages = ["", "about", "contact"].map(p => ({
    loc: `${ORIGIN}/${lang}/${p}`.replace(/\/$/, ""),
    lastmod: fmtDate(),
    changefreq: "monthly",
    priority: 0.6,
  }));

  const metaPages: any[] = (await safeJsonFetch(`${API_URL}/meta/pages`)) as any[];
  const metaUrls = metaPages.map(m => ({
    loc: `${ORIGIN}/${lang}/${m.slug}`,
    lastmod: fmtDate(m.updated_at),
    changefreq: "monthly",
    priority: 0.6,
  }));

  return new Response(buildUrlsetXML([...staticPages, ...metaUrls]), xml());
}
