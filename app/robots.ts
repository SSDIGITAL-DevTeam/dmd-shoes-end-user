import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://www.dmdshoeparts.com"
      : "http://localhost:3000");

  return {
    // kita pakai array rules supaya bisa kasih aturan khusus ke AI crawlers
    rules: [
      // 1) default untuk semua bot
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },

      // 2) AI / LLM crawlers populer
      {
        userAgent: "GPTBot", // OpenAI
        allow: "/",
      },
      {
        userAgent: "Google-Extended", // Google AI data crawling
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      {
        userAgent: "CCBot", // Common Crawl
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "FacebookBot",
        allow: "/",
      },
    ],
    // kalau kamu punya sitemap per-locale, tinggal jadikan array:
    // sitemap: [`${BASE_URL}/id/sitemap.xml`, `${BASE_URL}/en/sitemap.xml`],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
