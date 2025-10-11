"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";

const parseSafeJson = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : null;
};

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const upstreamBase = API_BASE_URL.replace(/\/+$/, "");
  const acceptLanguage = request.headers.get("accept-language") ?? undefined;
  const bodyText = await request.text();
  const hasBody = bodyText.length > 0;

  try {
    const upstream = await fetch(`${upstreamBase}/me/password/change`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(acceptLanguage ? { "Accept-Language": acceptLanguage } : {}),
      },
      body: hasBody ? bodyText : undefined,
      cache: "no-store",
    });

    const data = await parseSafeJson(upstream);
    const response = NextResponse.json(data, { status: upstream.status });

    if (upstream.status === 401) {
      response.cookies.delete(TOKEN_COOKIE_NAME);
    }

    return response;
  } catch (error) {
    console.error("Password change failed", error);
    return NextResponse.json(
      { message: "Failed to change password." },
      { status: 502 },
    );
  }
}
