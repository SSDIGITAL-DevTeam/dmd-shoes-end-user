// app/api/auth/customer/register/route.ts
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const TOKEN_COOKIE_NAME = "token";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function withTimeout(ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(timer) };
}

async function parseSafeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  const text = await res.text();
  return { message: text || res.statusText };
}

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const { signal, clear } = withTimeout(12_000); // 12s timeout

  try {
    const upstreamBase = API_BASE_URL.replace(/\/+$/, "");
    const response = await fetch(`${upstreamBase}/auth/customer/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });

    const data = await parseSafeJson(response);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const token = (data as any)?.data?.token;
    const payload = {
      status: (data as any)?.status ?? "success",
      message:
        (data as any)?.message ??
        "Registered successfully. Please verify your email.",
      data: (data as any)?.data,
    };

    const res = NextResponse.json(payload, { status: response.status });

    if (token) {
      res.cookies.set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // false on localhost
        maxAge: THIRTY_DAYS_IN_SECONDS,
        path: "/",
      });
    }

    return res;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { message: "Upstream API timeout." },
        { status: 504 }
      );
    }
    console.error("Customer register failed", err);
    return NextResponse.json(
      { message: "Customer registration failed." },
      { status: 502 }
    );
  } finally {
    clear();
  }
}
