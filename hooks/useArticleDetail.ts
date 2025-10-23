import { useQuery } from "@tanstack/react-query";
import { apiFetch, HttpError } from "@/lib/http";
import type { Article } from "@/services/types";

const buildQueryString = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const compiled = search.toString();
  return compiled ? `?${compiled}` : "";
};

const isNumericSlug = (value: string) => /^[0-9]+$/.test(value);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const unwrapArticle = (payload: unknown): Article | null => {
  if (!payload) return null;

  if (isObject(payload) && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (isObject(data)) {
      return data as Article;
    }
  }

  if (isObject(payload) && !Array.isArray(payload)) {
    return payload as Article;
  }

  return null;
};

const unwrapArticleList = (payload: unknown): Article[] => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload as Article[];
  }

  if (isObject(payload)) {
    if (Array.isArray(payload.data)) {
      return payload.data as Article[];
    }

    const nestedData = (payload as { data?: unknown }).data;
    if (isObject(nestedData) && Array.isArray(nestedData.data)) {
      return nestedData.data as Article[];
    }

    if (Array.isArray(payload.items)) {
      return payload.items as Article[];
    }

    if (Array.isArray(payload.records)) {
      return payload.records as Article[];
    }
  }

  return [];
};

async function fetchArticleDetail(slug: string, lang: string): Promise<Article> {
  const slugQuery = buildQueryString({ lang });

  try {
    const payload = await apiFetch(`/api/articles/slug/${encodeURIComponent(slug)}${slugQuery}`);
    const article = unwrapArticle(payload);
    if (article) return article;
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 404) {
      throw error;
    }
  }

  if (isNumericSlug(slug)) {
    try {
      const payload = await apiFetch(`/api/articles/${encodeURIComponent(slug)}${slugQuery}`);
      const article = unwrapArticle(payload);
      if (article) return article;
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 404) {
        throw error;
      }
    }
  }

  try {
    const listPayload = await apiFetch(
      `/api/articles${buildQueryString({
        slug,
        lang,
      })}`,
    );
    const candidates = unwrapArticleList(listPayload);
    const found = candidates.find(
      (item) => item?.slug === slug || (item as Record<string, unknown>)?.slug_id === slug,
    );
    if (found) return found;
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 404) {
      throw error;
    }
  }

  throw new HttpError(404, "Article not found", null);
}

export function useArticleDetail(slug: string, lang: string) {
  return useQuery<Article, HttpError>({
    queryKey: ["article-detail", slug, lang],
    queryFn: () => fetchArticleDetail(slug, lang),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      if (error.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
