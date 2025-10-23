import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const TOKEN_COOKIE_NAME = "token";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

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

export async function POST(request: Request) {
  if (!API_BASE) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const acceptLanguage = request.headers.get("accept-language") ?? undefined;
    const authorization = request.headers.get("authorization") ?? undefined;
    const upstream = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(acceptLanguage ? { "Accept-Language": acceptLanguage } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const { data, status, ok, text } = await parseUpstream(upstream);

    if (!ok) {
      const payload = data ?? { message: text || "Login failed" };
      return NextResponse.json(payload, { status });
    }

    const token =
      data?.token ??
      data?.data?.token ??
      null;

    const payload = {
      status: data?.status ?? "success",
      message: data?.message ?? "Login successful",
      user: data?.user ?? data?.data?.user ?? null,
      token,
    };

    const response = NextResponse.json(payload, { status });

    if (token) {
      const isProduction = process.env.NODE_ENV === "production";

      response.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: THIRTY_DAYS_IN_SECONDS,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { message: "Login failed. Please try again later." },
      { status: 500 },
    );
  }
}
