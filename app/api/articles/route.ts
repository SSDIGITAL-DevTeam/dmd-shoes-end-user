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

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const search = url.searchParams.toString();
  const upstreamBase = API_BASE_URL.replace(/\/+$/, "");
  const upstreamUrl = `${upstreamBase}/articles${search ? `?${search}` : ""}`;

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value ?? null;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await parseSafeJson(upstream);
    const response = NextResponse.json(data, { status: upstream.status });

    if (upstream.status === 401) {
      response.cookies.delete(TOKEN_COOKIE_NAME);
    }

    return response;
  } catch (error) {
    console.error("Fetch articles failed", error);
    return NextResponse.json({ message: "Failed to fetch articles." }, { status: 502 });
  }
}
