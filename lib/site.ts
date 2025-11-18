const FALLBACK_ORIGIN = "https://www.dmdshoeparts.com";

const normalizeOrigin = (value?: string | null) => {
  if (!value) return FALLBACK_ORIGIN;
  const trimmed = value.trim();
  if (!trimmed) return FALLBACK_ORIGIN;
  return trimmed.replace(/\/+$/, "");
};

export const SITE_ORIGIN = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

export const CDN_LOGO_PATH = "/logo.png";

export const getAbsoluteUrl = (input: string) => {
  if (!input) return SITE_ORIGIN;
  if (/^https?:\/\//i.test(input)) return input;
  const normalized = input.startsWith("/") ? input : `/${input}`;
  return `${SITE_ORIGIN}${normalized}`.replace("https:/", "https://");
};
