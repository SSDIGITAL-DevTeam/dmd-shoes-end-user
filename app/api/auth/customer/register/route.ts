import { cookies } from "next/headers";
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

    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/customer/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const token = data?.data?.token;
    if (token) {
      cookies().set({
        name: TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: THIRTY_DAYS_IN_SECONDS,
        path: "/",
      });
    }

    return NextResponse.json(
      {
        status: data?.status ?? "success",
        message:
          data?.message ??
          "Registered successfully. Please verify your email.",
        data: data?.data,
      },
      { status: response.status },
    );
  } catch (error) {
    console.error("Customer register failed", error);
    return NextResponse.json(
      {
        message: "Customer registration failed.",
      },
      { status: 500 },
    );
  }
}
