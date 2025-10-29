// app/[lang]/sitemap/pages.xml/route.ts
import { buildUrlsetXML, fmtDate, LOCALES, ORIGIN, xml } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang: rawLang } = await params;
  const lang = (LOCALES as readonly string[]).includes(rawLang) ? rawLang : "id";

  // ✅ HANYA 3 URL: /, /about, /contact (urut sesuai gambar)
  const staticPages = ["", "about", "contact", "product", "article"].map((p) => ({
    loc: `${ORIGIN}/${lang}/${p}`.replace(/\/$/, ""),
    lastmod: fmtDate(),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  return new Response(buildUrlsetXML(staticPages), xml());
}