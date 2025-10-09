const path = require("path");

const resolveEnv = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.VITE_API_BASE_URL;
  const assetUrl =
    process.env.NEXT_PUBLIC_ASSET_URL ?? process.env.VITE_ASSET_BASE_URL;

  if (!apiUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_URL (fallbacks: VITE_API_BASE_URL). Please set it in .env.local",
    );
  }

  if (!assetUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_ASSET_URL (fallbacks: VITE_ASSET_BASE_URL). Please set it in .env.local",
    );
  }

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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: resolveEnv(),
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
