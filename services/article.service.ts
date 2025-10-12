import { ApiError } from "@/lib/api-client";
import type { Article, Pagination } from "@/services/types";

export type ListArticlesParams = {
  page?: number;
  per_page?: number;
  search?: string;
  lang?: string;
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

const BASE_PATH = "/api/articles";

const buildQueryString = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const firstStringFromRecord = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      if (typeof entry === "string" && entry.trim() !== "") {
        return entry;
      }
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

const resolveCover = (raw: unknown): string | null => {
  if (typeof raw === "string" && raw.trim() !== "") {
    return raw;
  }
  return null;
};

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
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  let payload: T | null = null;
  try {
    payload = (await response.json()) as T;
  } catch {
    payload = null;
  }

  return { response, payload };
};

export const ArticleService = {
  async list(params: ListArticlesParams = {}): Promise<Pagination<Article>> {
    const query = buildQueryString(params);
    const { response, payload } = await fetchJson<ArticleListResponse>(
      `${BASE_PATH}${query}`,
    );

    if (!response.ok) {
      const message =
        (payload &&
          typeof payload === "object" &&
          typeof payload.message === "string" &&
          payload.message) ||
        response.statusText ||
        "Failed to fetch articles.";

      throw new ApiError(response.status, message, payload);
    }

    const dataRaw = Array.isArray(payload?.data) ? payload!.data : [];
    const meta = payload?.meta ?? {};

    const perPageCandidate =
      typeof payload?.per_page === "number"
        ? payload.per_page
        : typeof meta.per_page === "number"
          ? meta.per_page
          : typeof params.per_page === "number"
            ? params.per_page
            : 12;

    return {
      data: dataRaw.map(normalizeArticle),
      current_page:
        typeof payload?.current_page === "number"
          ? payload.current_page
          : typeof meta.current_page === "number"
            ? meta.current_page
            : typeof params.page === "number"
              ? params.page
              : 1,
      last_page:
        typeof payload?.last_page === "number"
          ? payload.last_page
          : typeof meta.last_page === "number"
            ? meta.last_page
            : 1,
      per_page: perPageCandidate,
      total:
        typeof payload?.total === "number"
          ? payload.total
          : typeof meta.total === "number"
            ? meta.total
            : dataRaw.length,
    };
  },

  async showBySlug(slug: string, params: { lang?: string } = {}): Promise<Article> {
    const query = buildQueryString(params);
    const { response, payload } = await fetchJson<ArticleResponse>(
      `${BASE_PATH}/slug/${encodeURIComponent(slug)}${query}`,
    );

    if (!response.ok) {
      const message =
        (payload &&
          typeof payload === "object" &&
          typeof payload.message === "string" &&
          payload.message) ||
        response.statusText ||
        "Failed to fetch article.";

      throw new ApiError(response.status, message, payload);
    }

    const rawData =
      payload && typeof payload === "object" && "data" in payload
        ? (payload as ArticleResponse).data
        : payload;

    return normalizeArticle(rawData);
  },

  async showById(id: number, params: { lang?: string } = {}): Promise<Article> {
    const query = buildQueryString(params);
    const { response, payload } = await fetchJson<ArticleResponse>(
      `${BASE_PATH}/${id}${query}`,
    );

    if (!response.ok) {
      const message =
        (payload &&
          typeof payload === "object" &&
          typeof payload.message === "string" &&
          payload.message) ||
        response.statusText ||
        "Failed to fetch article.";

      throw new ApiError(response.status, message, payload);
    }

    const rawData =
      payload && typeof payload === "object" && "data" in payload
        ? (payload as ArticleResponse).data
        : payload;

    return normalizeArticle(rawData);
  },
};

export type ArticleServiceType = typeof ArticleService;


