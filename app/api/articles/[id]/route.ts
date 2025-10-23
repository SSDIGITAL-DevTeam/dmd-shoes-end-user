import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const TOKEN_COOKIE_NAME = "token";

const collect = async (upstream: Response) => {
  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";

  return {
    text,
    contentType,
    status: upstream.status,
    ok: upstream.ok,
  };
};

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const { id } = await ctx.params;
    const target = `${API_BASE}/articles/${encodeURIComponent(id)}`;

    const cookieHeader = request.headers.get("cookie") ?? "";
    const authorizationHeader = request.headers.get("authorization") ?? "";

    const jar = await cookies();
    const tokenFromCookie = jar.get(TOKEN_COOKIE_NAME)?.value ?? null;
    const bearer =
      authorizationHeader && authorizationHeader.toLowerCase().startsWith("bearer ")
        ? authorizationHeader
        : tokenFromCookie
          ? `Bearer ${tokenFromCookie}`
          : "";

    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(bearer ? { Authorization: bearer } : {}),
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
      credentials: "include",
    });

    const { text, contentType, status, ok } = await collect(upstream);

    if (!ok) {
      console.error("API /articles/:id error:", status, text.slice(0, 200));
    }

    const response = new NextResponse(text, {
      status,
      headers: { "content-type": contentType },
    });

    if (status === 401) {
      response.cookies.delete(TOKEN_COOKIE_NAME);
    }

    return response;
  } catch (error) {
    console.error("Proxy /api/articles/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch article." },
      { status: 502 },
    );
  }
}
