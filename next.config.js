// next.config.js
const path = require("path");

const resolveEnv = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.VITE_API_BASE_URL;
  const assetUrl = process.env.NEXT_PUBLIC_ASSET_URL ?? process.env.VITE_ASSET_BASE_URL;

  if (!apiUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_URL (fallback: VITE_API_BASE_URL). Set it in .env.local"
    );
  }
  if (!assetUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_ASSET_URL (fallback: VITE_ASSET_BASE_URL). Set it in .env.local"
    );
  }

  return {
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_ASSET_URL: assetUrl,
    // Keep Vite vars for tests/scripts if you use them:
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL ?? apiUrl,
    VITE_ASSET_BASE_URL: process.env.VITE_ASSET_BASE_URL ?? assetUrl,
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // List ONLY the domains you use.
    remotePatterns: [
      // Pexels
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      // Your CDN(s) – adjust to your real host(s)
      { protocol: "https", hostname: "cdn.example.com", pathname: "/**" },
      // Laravel storage if you serve direct
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" }, // <- example
      // Dev only: local http images
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
    // Optional: better formats when upstream supports it
    formats: ["image/avif", "image/webp"],
    // Optional: cache hint for image optimizer
    minimumCacheTTL: 60, // seconds; tune as you like
  },

  // Don't hide TS errors in production; it masks real issues.
  // You can gate this with NODE_ENV if you truly need it in dev.
  typescript: { ignoreBuildErrors: process.env.NODE_ENV !== "production" },
  env: resolveEnv(),
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
