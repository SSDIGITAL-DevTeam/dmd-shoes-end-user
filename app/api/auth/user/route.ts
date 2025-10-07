import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        message: "NEXT_PUBLIC_API_URL is not configured.",
      },
      { status: 500 },
    );
  }

  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      cookies().delete(TOKEN_COOKIE_NAME);
      return NextResponse.json(data, { status: response.status });
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
    cookies().delete(TOKEN_COOKIE_NAME);
    return NextResponse.json(
      {
        message: "Failed to fetch authenticated user.",
      },
      { status: 500 },
    );
  }
}
