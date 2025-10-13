import { ApiError } from "@/lib/api-client";
import type { Article, Pagination } from "@/services/types";

export type ListArticlesParams = {
  page?: number;
  per_page?: number;
  search?: string;
  lang?: string;
  status?: string; // optional (publish/draft) kalau backend-mu pakai
  [key: string]: unknown;
};

type ArticleListResponse = {
  status?: string;
  message?: string;
  data?: unknown;
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
};

type ArticleResponse = {
  status?: string;
  message?: string;
  data?: unknown;
};

// === Base URL langsung ke Laravel (bukan via /api/articles Next) ===
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
if (!API_BASE) {
  console.error("Missing env NEXT_PUBLIC_API_URL");
}
const BASE_PATH = `${API_BASE}/articles`;

// ---------------- utils ----------------
const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const buildQueryString = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    sp.set(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : "";
};

const firstStringFromRecord = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      if (typeof entry === "string" && entry.trim() !== "") return entry;
    }
  }
  return null;
};

const makeExcerpt = (content: string | null | undefined, length = 160): string | null => {
  if (!content) return null;
  const plain = content.replace(/\s+/g, " ").trim();
  if (!plain) return null;
  if (plain.length <= length) return plain;
  return `${plain.slice(0, length).trimEnd()}...`;
};

const resolveCover = (raw: unknown): string | null =>
  typeof raw === "string" && raw.trim() !== "" ? raw : null;

const normalizeArticle = (raw: unknown): Article => {
  const item = (raw ?? {}) as Record<string, unknown>;

  const idValue = item.id;
  const id = typeof idValue === "number" ? idValue : Number(idValue ?? 0);

  const titleFromText =
    typeof item.title_text === "string" && item.title_text.trim() !== ""
      ? item.title_text
      : null;
  const titleFromSource = firstStringFromRecord(item.title);
  const title = titleFromText ?? titleFromSource ?? "";

  const contentText =
    typeof item.content_text === "string" && item.content_text.trim() !== ""
      ? item.content_text
      : null;

  const excerpt =
    typeof item.excerpt === "string" && item.excerpt.trim() !== ""
      ? item.excerpt
      : makeExcerpt(contentText);

  const slug =
    typeof item.slug === "string" && item.slug.trim() !== "" ? item.slug.trim() : null;

  const coverUrl = resolveCover(item.cover_url) ?? resolveCover(item.cover);

  const publishedAt =
    typeof item.published_at === "string"
      ? item.published_at
      : typeof item.created_at === "string"
        ? item.created_at
        : null;

  const authorName =
    typeof item.author_name === "string" && item.author_name.trim() !== ""
      ? item.author_name
      : null;

  return {
    id,
    slug,
    slug_id: id ? String(id) : null,
    title,
    title_text: titleFromText,
    excerpt,
    cover: resolveCover(item.cover),
    cover_url: coverUrl,
    content: item.content as Article["content"],
    content_text: contentText,
    author_name: authorName,
    status: typeof item.status === "string" ? item.status : null,
    published:
      typeof item.published === "boolean"
        ? item.published
        : typeof item.published === "number"
          ? item.published === 1
          : null,
    created_at: typeof item.created_at === "string" ? item.created_at : null,
    updated_at: typeof item.updated_at === "string" ? item.updated_at : null,
    published_at: publishedAt,
  };
};

const fetchJson = async <T>(
  url: string,
  options?: RequestInit,
): Promise<{ response: Response; payload: T | null }> => {
  const res = await fetch(url, {
    // HAPUS: credentials: "include",
    // Tambahkan mode cors (opsional, default-nya juga cors kalau cross-origin)
    mode: "cors",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  let payload: T | null = null;
  try {
    payload = (await res.json()) as T;
  } catch {
    payload = null;
  }
  return { response: res, payload };
};

// --------------- API ---------------
export async function listArticles(
  params: ListArticlesParams = {},
): Promise<Pagination<Article>> {
  const query = buildQueryString(params);
  const { response, payload } = await fetchJson<ArticleListResponse>(`${BASE_PATH}${query}`);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && typeof (payload as any).message === "string" && (payload as any).message) ||
      response.statusText ||
      "Failed to fetch articles.";
    throw new ApiError(response.status, message, payload);
  }

  const dataRaw = Array.isArray(payload?.data) ? payload!.data : [];
  const meta = payload?.meta ?? {};

  const perPageCandidate =
    toNumber(payload?.per_page) ??
    toNumber(meta.per_page) ??
    toNumber(params.per_page) ??
    6;

  return {
    data: dataRaw.map(normalizeArticle),
    current_page:
      toNumber(payload?.current_page) ??
      toNumber(meta.current_page) ??
      toNumber(params.page) ??
      1,
    last_page:
      toNumber(payload?.last_page) ??
      toNumber(meta.last_page) ??
      Math.max(
        1,
        Math.ceil((toNumber(meta.total) ?? dataRaw.length) / Math.max(perPageCandidate, 1)),
      ),
    per_page: perPageCandidate,
    total:
      toNumber(payload?.total) ??
      toNumber(meta.total) ??
      dataRaw.length,
  };
}

export async function latestArticle(params: { lang?: string } = {}): Promise<Article | null> {
  // tambahkan status: 'publish' kalau ingin hanya artikel publish
  const page1 = await listArticles({ ...params, page: 1, per_page: 1, status: "publish" });
  return page1.data[0] ?? null;
}

export async function getArticleBySlug(
  slug: string,
  params: { lang?: string } = {},
): Promise<Article> {
  const query = buildQueryString(params);
  const { response, payload } = await fetchJson<ArticleResponse>(
    `${BASE_PATH}/slug/${encodeURIComponent(slug)}${query}`,
  );

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && typeof (payload as any).message === "string" && (payload as any).message) ||
      response.statusText ||
      "Failed to fetch article.";
    throw new ApiError(response.status, message, payload);
  }

  const raw =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as ArticleResponse).data
      : payload;

  return normalizeArticle(raw);
}

export async function getArticleById(
  id: number,
  params: { lang?: string } = {},
): Promise<Article> {
  const query = buildQueryString(params);
  const { response, payload } = await fetchJson<ArticleResponse>(`${BASE_PATH}/${id}${query}`);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && typeof (payload as any).message === "string" && (payload as any).message) ||
      response.statusText ||
      "Failed to fetch article.";
    throw new ApiError(response.status, message, payload);
  }

  const raw =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as ArticleResponse).data
      : payload;

  return normalizeArticle(raw);
}

// Optional: object export
export const ArticleService = {
  list: listArticles,
  latest: latestArticle,
  showBySlug: getArticleBySlug,
  showById: getArticleById,
};
export type ArticleServiceType = typeof ArticleService;
