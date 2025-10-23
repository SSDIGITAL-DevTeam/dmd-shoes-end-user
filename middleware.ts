// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n-config";

const TOKEN_COOKIE_NAME = "token";
const protectedRoutes = ["/profile", "/wishlist"];
const authPages = ["/auth/login", "/auth/register"];

function getCookieLocale(request: NextRequest): string | null {
  const cookie =
    request.cookies.get("NEXT_LOCALE")?.value ||
    request.cookies.get("locale")?.value ||
    null;
  return cookie && i18n.locales.includes(cookie as any) ? cookie : null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // belum ada prefix locale?
  const pathnameIsMissingLocale = i18n.locales.every(
    (l) => !pathname.startsWith(`/${l}/`) && pathname !== `/${l}`
  );

  if (pathnameIsMissingLocale) {
    const normalizedPath =
      pathname !== "/" ? pathname.replace(/\/+$/, "") || "/" : pathname;

    const specialRoutes: Record<string, string> = {
      "/reset-password": "/auth/reset-password",
    };

    const mappedPath = specialRoutes[normalizedPath] ?? normalizedPath;

    const cookieLocale = getCookieLocale(request);
    const locale = cookieLocale ?? i18n.defaultLocale; // => "id"

    const url = new URL(request.url);
    url.pathname = `/${locale}${mappedPath === "/" ? "" : mappedPath}`;
    return NextResponse.redirect(url);
  }

  // ===== auth guard (opsional) =====
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] ?? i18n.defaultLocale;
  const rawRoute = segments.slice(1).join("/");
  const route = (`/${rawRoute}`).replace(/\/$/, "") || "/";
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const needsAuth = protectedRoutes.some((protectedRoute) =>
      route.startsWith(protectedRoute),
    );

    if (needsAuth) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url),
      );
    }
  } else {
    const visitingAuthPage = authPages.some((page) => route.startsWith(page));

    if (visitingAuthPage) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
