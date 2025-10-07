import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";

export async function DELETE() {
  const tokenCookie = cookies().get(TOKEN_COOKIE_NAME);

  if (tokenCookie?.value && API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/api/v1/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenCookie.value}`,
        },
      });
    } catch (error) {
      console.error("Logout request to backend failed", error);
    }
  }

  cookies().delete(TOKEN_COOKIE_NAME);

  return NextResponse.json(
    {
      status: "success",
      message: "Logged out successfully.",
    },
    { status: 200 },
  );
}
