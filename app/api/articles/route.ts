// (server file – hanya export async handlers)
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ex: http://localhost:8000/api/v1
const TOKEN_COOKIE_NAME = "token";

async function parseSafeJson(r: Response) {
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { return await r.json(); } catch { return null; }
  }
  const txt = await r.text().catch(() => "");
  return txt ? { message: txt } : null;
}

export async function GET(request: Request) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json({ message: "NEXT_PUBLIC_API_URL is not configured." }, { status: 500 });
    }

    const url = new URL(request.url);
    const search = url.search; // ?page=...&per_page=...
    const upstream = `${API_BASE_URL.replace(/\/+$/, "")}/articles${search}`;

    const jar = await cookies();
    const token = jar.get(TOKEN_COOKIE_NAME)?.value;

    const res = await fetch(upstream, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      credentials: "include",
    });

    const data = await parseSafeJson(res);
    const out = NextResponse.json(data, { status: res.status });

    if (res.status === 401) out.cookies.delete(TOKEN_COOKIE_NAME);
    return out;
  } catch (err) {
    console.error("Proxy /api/articles failed:", err);
    return NextResponse.json({ message: "Failed to fetch articles." }, { status: 502 });
  }
}
