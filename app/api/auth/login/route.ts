import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        message: "NEXT_PUBLIC_API_URL is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const upstreamBase = API_BASE_URL.replace(/\/+$/, "");

    const response = await fetch(`${upstreamBase}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
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

    const res = NextResponse.json(payload, { status: response.status });

    if (token) {
      res.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: THIRTY_DAYS_IN_SECONDS,
        path: "/",
      });
    }

    return res;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      {
        message: "Login failed. Please try again later.",
      },
      { status: 500 },
    );
  }
}
