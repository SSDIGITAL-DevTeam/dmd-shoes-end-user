const path = require("path");

const resolveEnv = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.VITE_API_BASE_URL;
  const assetUrl = process.env.NEXT_PUBLIC_ASSET_URL ?? process.env.VITE_ASSET_BASE_URL;
  if (!apiUrl) throw new Error("Missing NEXT_PUBLIC_API_URL (fallback: VITE_API_BASE_URL). Set it in .env.local");
  if (!assetUrl) throw new Error("Missing NEXT_PUBLIC_ASSET_URL (fallback: VITE_ASSET_BASE_URL). Set it in .env.local");
  return {
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_ASSET_URL: assetUrl,
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL ?? apiUrl,
    VITE_ASSET_BASE_URL: process.env.VITE_ASSET_BASE_URL ?? assetUrl,
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 960, 1080, 1200, 1600],
    imageSizes: [64, 96, 128, 192, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "api.dmdshoeparts.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "dmdshoeparts.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "www.dmdshoeparts.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
    minimumCacheTTL: 60 * 60,
  },
  experimental: {
    optimizePackageImports: ["@tanstack/react-query", "react-icons"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  modularizeImports: {
    "react-icons/(?<path>.*)": {
      transform: "react-icons/{{ path }}/{{member}}",
    },
  },
  typescript: { ignoreBuildErrors: process.env.NODE_ENV !== "production" },
  env: resolveEnv(),
  outputFileTracingRoot: path.resolve(__dirname),
  async headers() {
    return [
      {
        source: "/:all*(js|css)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(png|jpg|jpeg|gif|svg|webp|avif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(woff|woff2|ttf|otf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
