import { ASSET_URL } from "@/lib/env";

const ASSET_BASE = ASSET_URL.replace(/\/+$/, "");

const toAbsoluteAsset = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("data:")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  if (/^\/?storage\//i.test(trimmed)) {
    const relative = trimmed.replace(/^\/?storage\/?/, "");
    return `${ASSET_BASE}/${relative}`;
  }

  return trimmed;
};

const hydrateInternal = (input: unknown): unknown => {
  if (typeof input === "string") {
    return toAbsoluteAsset(input);
  }

  if (Array.isArray(input)) {
    return input.map((item) => hydrateInternal(item));
  }

  if (input && typeof input === "object") {
    if (input instanceof Date || input instanceof URL) {
      return input;
    }

    const entries = Object.entries(input as Record<string, unknown>).map(
      ([key, value]) => [key, hydrateInternal(value)],
    );

    return Object.fromEntries(entries);
  }

  return input;
};

export const hydrateAssets = <T>(payload: T): T => hydrateInternal(payload) as T;
