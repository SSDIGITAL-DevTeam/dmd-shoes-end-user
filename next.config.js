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
    // Matikan AVIF dulu → iOS lama aman
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      // Stock images
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },

      // API domain yang serve /storage/*
      { protocol: "https", hostname: "api.dmdshoeparts.com", pathname: "/storage/**" },

      // ROOT domain (tanpa www)
      { protocol: "https", hostname: "dmdshoeparts.com", pathname: "/storage/**" },

      // ✅ Tambahkan WWW domain (ini yang bikin gambar di www gak muncul)
      { protocol: "https", hostname: "www.dmdshoeparts.com", pathname: "/storage/**" },

      // Dev
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
    // DEBUG cepat: uncomment jika mau bypass optimizer Next
    // unoptimized: true,
  },

  typescript: { ignoreBuildErrors: process.env.NODE_ENV !== "production" },
  env: resolveEnv(),
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
