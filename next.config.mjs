import path from "node:path";
import { fileURLToPath } from "node:url";

const resolveEnv = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.VITE_API_BASE_URL;
  const assetUrl = process.env.NEXT_PUBLIC_ASSET_URL ?? process.env.VITE_ASSET_BASE_URL;
  if (!apiUrl) throw new Error("Missing NEXT_PUBLIC_API_URL (fallbacks: VITE_API_BASE_URL). Please add it to .env.local.");
  if (!assetUrl) throw new Error("Missing NEXT_PUBLIC_ASSET_URL (fallbacks: VITE_ASSET_BASE_URL). Please add it to .env.local.");
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
    unoptimized: true,
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "api.dmdshoeparts.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "dmdshoeparts.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "www.dmdshoeparts.com", pathname: "/storage/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
    minimumCacheTTL: 60,
  },
  typescript: { ignoreBuildErrors: true },
  env: resolveEnv(),
  outputFileTracingRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url))),
};

export default nextConfig;
