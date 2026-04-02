// utils/generateMetadata.ts (DMD)

import { axiosInstance } from "@/lib/axios";
import type { Metadata } from "next";

// ==== SESUAIKAN BAGIAN INI UNTUK DMD ====

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.dmdshoeparts.com";

const DEFAULT_IMAGE = `${DEFAULT_BASE_URL}/images/og-default-dmd.png`; // ganti ke path OG image DMD

const BRAND_NAME = "DMD Shoes";

type CmsMetaTag = {
  attr?: string;
  identifier?: string; // key, mis: "title", "description", "og:title"
  content?: string | null;
};

// ========================================

type GenerateMetadataArgs = {
  title?: string;
  description?: string;
  keywords?: string[];
  path: string;
  canonicalBaseUrl?: string;
  noindex?: boolean;
  locale?: string;
  openGraphOverride?: Partial<Metadata["openGraph"]>;
  twitterOverride?: Partial<Metadata["twitter"]>;
  cmsPath?: string; // slug halaman di CMS, mis: "home", "career", "product-detail"
};

type CmsOverrides = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  robots?: Metadata["robots"];
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
};

type OpenGraphType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

type TwitterCardType = "summary_large_image" | "summary" | "player" | "app";

type OpenGraphImages =
  | string
  | string[]
  | Array<{ url: string; width?: number; height?: number; alt?: string }>;

type TwitterImages = string | string[] | Array<{ url: string }>;

const normalizeBase = (value?: string) =>
  (value || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL).replace(
    /\/$/,
    "",
  );

const normalizePath = (value: string) => {
  if (!value || value === "/") return "/";
  const leading = value.startsWith("/") ? value : `/${value}`;
  return leading.replace(/\/{2,}/g, "/").replace(/\/$/, "");
};

const parseRobots = (value?: string): Metadata["robots"] | undefined => {
  if (!value) return undefined;
  const tokens = value
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  return {
    index: !tokens.includes("noindex"),
  follow: !tokens.includes("nofollow"),
  };
};

const normalizeCmsLocale = (value?: string) => {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (normalized.startsWith("en")) return "en";
  return "id";
};

// === BAGIAN YANG NGAMBIL META DARI CMS BACKEND DMD ===
// Kalau backend-mu belum punya meta CMS, fungsi ini akan selalu
// return null dan tidak mengganggu apa pun.
const fetchCmsOverrides = async (
  cmsPath?: string,
  locale?: string,
): Promise<CmsOverrides | null> => {
  if (!cmsPath) return null;

  try {
    const response = await axiosInstance.get(
      `/meta/by-slug/${encodeURIComponent(cmsPath)}`,
      {
        params: { locale: normalizeCmsLocale(locale) },
        timeout: 5000,
      },
    );

    const meta = response?.data?.data as CmsMetaTag[] | undefined;
    if (!meta?.length) return null;

    const getValue = (identifier: string) =>
      meta.find((item) => item.identifier === identifier)?.content?.trim();

    const keywordsValue = getValue("keywords");
    const keywords = keywordsValue
      ? keywordsValue.split(",").map((item) => item.trim()).filter(Boolean)
      : undefined;

    const ogImages = getValue("og:image") || getValue("og:images");
    const twitterImages = getValue("twitter:image") || getValue("twitter:images");

    return {
      title: getValue("title"),
      description: getValue("description"),
      keywords,
      canonical: getValue("canonical"),
      robots: parseRobots(getValue("robot") || getValue("robots")),
      openGraph: {
        title: getValue("og:title"),
        description: getValue("og:description"),
        url: getValue("og:url"),
        siteName: getValue("og:site_name"),
        locale: getValue("og:locale"),
        type: (getValue("og:type") as OpenGraphType) ?? "website",
        images: ogImages || undefined,
      },
      twitter: {
        card:
          (getValue("twitter:card") as TwitterCardType | undefined) ??
          "summary_large_image",
        title: getValue("twitter:title"),
        description: getValue("twitter:description"),
        site: getValue("twitter:site"),
        creator: getValue("twitter:creator"),
        images: twitterImages || undefined,
      },
    };
  } catch (error: any) {
    // kalau gagal, jangan bikin build meledak; cukup abaikan override
    // 404 = slug meta belum tersedia
    if (error?.response?.status !== 404) {
      console.error("generateMetadata: failed to fetch CMS meta", error);
    }
    return null;
  }
};

export async function generateMetadata({
  title,
  description,
  keywords,
  path,
  canonicalBaseUrl,
  noindex,
  locale = "id-ID",
  openGraphOverride,
  twitterOverride,
  cmsPath,
}: GenerateMetadataArgs): Promise<Metadata> {
  const base = normalizeBase(canonicalBaseUrl);
  const normalizedPath = normalizePath(path);

  const canonical =
    normalizedPath === "/"
      ? base
      : `${base}${normalizedPath}`.replace(/(?<!:)\/{2,}/g, "/");

  // cmsPath default ke slug path (home, career, dsb.)
  const cmsOverrides = await fetchCmsOverrides(
    cmsPath ?? (normalizedPath.replace(/^\//, "") || "home"),
    locale,
  );

  const resolvedTitle = cmsOverrides?.title || title;
  const resolvedDescription = cmsOverrides?.description || description;
  const resolvedKeywords = cmsOverrides?.keywords || keywords;

  const robots: Metadata["robots"] =
    noindex === true
      ? { index: false, follow: true, nocache: true }
      : cmsOverrides?.robots || { index: true, follow: true };

  const ogImages: OpenGraphImages =
    (cmsOverrides?.openGraph?.images as OpenGraphImages | undefined) ||
    (openGraphOverride?.images as OpenGraphImages | undefined) || [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: resolvedTitle ?? BRAND_NAME,
      },
    ];

  const cmsOgType = (cmsOverrides?.openGraph as Record<string, unknown> | undefined)
    ?.type as OpenGraphType | undefined;
  const overrideOgType = (openGraphOverride as Record<string, unknown> | undefined)
    ?.type as OpenGraphType | undefined;

  const og = {
    url: cmsOverrides?.openGraph?.url || openGraphOverride?.url || canonical,
    siteName:
      cmsOverrides?.openGraph?.siteName ||
      openGraphOverride?.siteName ||
      BRAND_NAME,
    title:
      cmsOverrides?.openGraph?.title ||
      openGraphOverride?.title ||
      resolvedTitle ||
      BRAND_NAME,
    description:
      cmsOverrides?.openGraph?.description ||
      openGraphOverride?.description ||
      resolvedDescription,
    locale:
      cmsOverrides?.openGraph?.locale ||
      openGraphOverride?.locale ||
      locale ||
      "id-ID",
    type: cmsOgType || overrideOgType || "website",
    images: ogImages,
  } as NonNullable<Metadata["openGraph"]>;

  const cmsTwitter = cmsOverrides?.twitter as Record<string, unknown> | undefined;
  const overrideTwitter = twitterOverride as Record<string, unknown> | undefined;

  const twitterImages: TwitterImages =
    (cmsTwitter?.images as TwitterImages | undefined) ||
    (overrideTwitter?.images as TwitterImages | undefined) ||
    (Array.isArray(ogImages)
      ? (ogImages as any)[0]?.url || DEFAULT_IMAGE
      : ogImages) ||
    DEFAULT_IMAGE;

  const twitterMeta = {
    card:
      (cmsTwitter?.card as TwitterCardType | undefined) ||
      (overrideTwitter?.card as TwitterCardType | undefined) ||
      "summary_large_image",
    title:
      (cmsTwitter?.title as string | undefined) ||
      (overrideTwitter?.title as string | undefined) ||
      resolvedTitle ||
      BRAND_NAME,
    description:
      (cmsTwitter?.description as string | undefined) ||
      (overrideTwitter?.description as string | undefined) ||
      resolvedDescription,
    site:
      (cmsTwitter?.site as string | undefined) ||
      (overrideTwitter?.site as string | undefined),
    creator:
      (cmsTwitter?.creator as string | undefined) ||
      (overrideTwitter?.creator as string | undefined),
    images: twitterImages,
  } satisfies Record<string, unknown>;

  return {
    metadataBase: new URL(base),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    robots,
    alternates: {
      canonical,
      languages: {
        "x-default": canonical,
        [og.locale || locale]: canonical,
      },
    },
    openGraph: og,
    twitter: twitterMeta as Metadata["twitter"],
  };
}

export default generateMetadata;
