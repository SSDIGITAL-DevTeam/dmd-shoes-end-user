// app/[lang]/sitemap_index.xml/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LOCALES, ORIGIN, indexXML, fmtDate, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const active = (LOCALES as readonly string[]).includes(lang) ? lang : "id";

  const items = [
    { loc: `${ORIGIN}/${active}/articles-sitemap.xml`,   lastmod: fmtDate() },
    { loc: `${ORIGIN}/${active}/products-sitemap.xml`,   lastmod: fmtDate() },
    { loc: `${ORIGIN}/${active}/categories-sitemap.xml`, lastmod: fmtDate() },
    { loc: `${ORIGIN}/${active}/pages-sitemap.xml`,      lastmod: fmtDate() },
  ];

  const xml = indexXML(items);
  return new NextResponse(xml, { status: 200, headers: xmlHeaders() });
}
