const ensureEnv = (
  value: string | undefined,
  fallback: string | undefined,
  primary: string,
  fallbackKey?: string,
): string => {
  const resolved = value ?? fallback;
  if (typeof resolved === "string" && resolved.trim() !== "") {
    return resolved;
  }
  const hint = fallbackKey ? `${primary} (fallbacks: ${fallbackKey})` : primary;
  throw new Error(`Missing environment variable: ${hint}`);
};

const isServer = typeof window === "undefined";

export const API_URL = ensureEnv(
  process.env.NEXT_PUBLIC_API_URL,
  isServer ? process.env.VITE_API_BASE_URL : undefined,
  "NEXT_PUBLIC_API_URL",
  "VITE_API_BASE_URL",
);

export const ASSET_URL = ensureEnv(
  process.env.NEXT_PUBLIC_ASSET_URL,
  isServer ? process.env.VITE_ASSET_BASE_URL : undefined,
  "NEXT_PUBLIC_ASSET_URL",
  "VITE_ASSET_BASE_URL",
);
