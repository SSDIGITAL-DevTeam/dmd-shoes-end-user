import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = "token";

export async function DELETE() {
  // ✅ cookies() harus di-await (async API di Next.js 15)
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_COOKIE_NAME);

  if (tokenCookie?.value && API_BASE_URL) {
    try {
      const upstreamBase = API_BASE_URL.replace(/\/+$/, "");
      await fetch(`${upstreamBase}/logout`, {
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

  // ✅ Hapus cookie via NextResponse (karena cookies() sekarang read-only)
  const res = NextResponse.json(
    {
      status: "success",
      message: "Logged out successfully.",
    },
    { status: 200 },
  );

  res.cookies.delete(TOKEN_COOKIE_NAME);
  return res;
}
