// app/[lang]/categories-sitemap.xml/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RUNTIME, LOCALES, ORIGIN, API_BASE, fetchAll, urlsetXML, fmtDate, xmlHeaders } from "@/lib/sitemap";

export const runtime = RUNTIME;

export async function GET(req: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const active = (LOCALES as readonly string[]).includes(lang) ? lang : "id";
  if (!API_BASE) return NextResponse.json({ message: "NEXT_PUBLIC_API_URL not set" }, { status: 500 });

  const items = await fetchAll<any>(`${API_BASE}/categories`, req, 100);

  const urls = items.map((c) => ({
    loc: `${ORIGIN}/${active}/category/${c.slug}`,
    lastmod: fmtDate(c.updated_at),
    changefreq: "weekly",
    priority: 0.7,
  }));

  const xml = urlsetXML(urls);
  return new NextResponse(xml, { status: 200, headers: xmlHeaders() });
}
