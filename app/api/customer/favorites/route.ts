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

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const upstreamBase = API_BASE_URL.replace(/\/+$/, "");

  try {
    const upstream = await fetch(`${upstreamBase}/favorites`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await parseSafeJson(upstream);

    if (upstream.status === 401) {
      const res = NextResponse.json(data, { status: 401 });
      res.cookies.delete(TOKEN_COOKIE_NAME);
      return res;
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Favorites list failed", error);
    return NextResponse.json(
      { message: "Failed to fetch favorites." },
      { status: 502 },
    );
  }
}
