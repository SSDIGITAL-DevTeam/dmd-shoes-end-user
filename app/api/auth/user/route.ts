import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value ?? null;

  const headerAuthorization = request.headers.get("authorization") ?? "";
  const headerToken = headerAuthorization.toLowerCase().startsWith("bearer ")
    ? headerAuthorization.slice(7).trim()
    : headerAuthorization.trim() || null;

  const token = cookieToken ?? headerToken ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const upstreamBase = API_BASE_URL.replace(/\/+$/, "");
    const upstream = await fetch(`${upstreamBase}/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      if (upstream.status === 401) {
        const res = NextResponse.json(data, { status: upstream.status });
        res.cookies.delete(TOKEN_COOKIE_NAME);
        return res;
      }

      return NextResponse.json(data, { status: upstream.status });
    }

    const user = data?.data ?? data?.user ?? data;

    return NextResponse.json(
      {
        user,
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetching user failed", error);
    return NextResponse.json(
      { message: "Failed to fetch authenticated user." },
      { status: 500 },
    );
  }
}
