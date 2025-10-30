import { MetadataRoute } from "next";

/**
 * Robots.txt Generator — DMD Shoeparts (Per-Locale)
 * -------------------------------------------------
 * Menghasilkan robots.txt sesuai bahasa (id/en)
 * agar setiap versi bahasa mengarah ke sitemap-nya masing-masing.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://www.dmdshoeparts.com"
    : "http://localhost:3000");

const LOCALES = ["id", "en"] as const;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default function robots({
  params,
}: {
  params: { lang: string };
}): MetadataRoute.Robots {
  const { lang } = params;
  if (!LOCALES.includes(lang as any)) {
    // fallback default kalau locale invalid
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE_URL}/${lang}/sitemap.xml`,
  };
}
