import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const parseUpstream = async (res: Response) => {
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }

  return { data, text, status: res.status, ok: res.ok };
};

export async function POST(request: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const search = request.nextUrl.search;
    const contentType = request.headers.get("content-type") ?? "application/json";
    const acceptLanguage = request.headers.get("accept-language") ?? undefined;
    const authorization = request.headers.get("authorization") ?? undefined;
    const bodyText = await request.text();

    const upstream = await fetch(`${API_BASE}/email/verify${search}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": contentType,
        ...(acceptLanguage ? { "Accept-Language": acceptLanguage } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
        "X-Requested-With": "XMLHttpRequest",
      },
      body: bodyText.length ? bodyText : undefined,
      cache: "no-store",
    });

    const { data, text, status, ok } = await parseUpstream(upstream);

    if (status === 204) {
      return new NextResponse(null, { status });
    }

    if (!ok) {
      const payload = data ?? { message: text || "Email verification failed." };
      return NextResponse.json(payload, { status });
    }

    return NextResponse.json(data ?? { status: "ok" }, { status });
  } catch (error) {
    console.error("Proxy /email/verify failed:", error);
    return NextResponse.json(
      { message: "Failed to verify email." },
      { status: 502 },
    );
  }
}
