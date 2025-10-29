// app/[lang]/products-sitemap.xml/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LOCALES, ORIGIN, API_BASE, fetchAll, urlsetXML, fmtDate, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const active = (LOCALES as readonly string[]).includes(lang) ? lang : "id";
  if (!API_BASE) return NextResponse.json({ message: "NEXT_PUBLIC_API_URL not set" }, { status: 500 });

  const items = await fetchAll<any>(`${API_BASE}/products`, req, 100);

  const urls = items.map((p) => ({
    // kalau bilingual: const slug = active==="id" ? p.slug_id : p.slug_en;
    loc: `${ORIGIN}/${active}/products/${p.slug}`,
    lastmod: fmtDate(p.updated_at),
    changefreq: "weekly",
    priority: 0.9,
  }));

  const xml = urlsetXML(urls);
  return new NextResponse(xml, { status: 200, headers: xmlHeaders() });
}
