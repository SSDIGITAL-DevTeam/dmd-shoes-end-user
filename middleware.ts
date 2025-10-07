import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const TOKEN_COOKIE_NAME = "token";
const protectedRoutes = ["/profile", "/wishlist"];
const authPages = ["/auth/login", "/auth/register"];

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = i18n.locales as unknown as string[];

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

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
