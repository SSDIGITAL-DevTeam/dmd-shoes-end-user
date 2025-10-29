// app/[lang]/pages-sitemap.xml/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LOCALES, ORIGIN, API_BASE, fetchAll, urlsetXML, fmtDate, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const active = (LOCALES as readonly string[]).includes(lang) ? lang : "id";
  if (!API_BASE) return NextResponse.json({ message: "NEXT_PUBLIC_API_URL not set" }, { status: 500 });

  const staticPages = ["", "about", "contact"].map((p) => ({
    loc: `${ORIGIN}/${active}/${p}`.replace(/\/$/, ""),
    lastmod: fmtDate(),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  const metaPages = await fetchAll<any>(`${API_BASE}/meta/pages`, req, 200);
  const metaUrls = metaPages.map((m) => ({
    loc: `${ORIGIN}/${active}/${m.slug}`,
    lastmod: fmtDate(m.updated_at),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  const xml = urlsetXML([...staticPages, ...metaUrls]);
  return new NextResponse(xml, { status: 200, headers: xmlHeaders() });
}
