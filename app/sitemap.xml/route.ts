// app/sitemap.xml/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LOCALES, ORIGIN, indexXML, fmtDate, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  const items = LOCALES.map((lang) => ({
    loc: `${ORIGIN}/${lang}/sitemap_index.xml`,
    lastmod: fmtDate(),
  }));
  const xml = indexXML(items);
  return new NextResponse(xml, { status: 200, headers: xmlHeaders() });
}
