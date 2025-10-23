import { useQuery } from "@tanstack/react-query";
import { apiFetch, HttpError } from "@/lib/http";

const buildQuery = (lang: string) => {
  const search = new URLSearchParams();
  if (lang) search.set("lang", lang);
  return search.toString() ? `?${search.toString()}` : "";
};

const isNumericSlug = (value: string) => /^[0-9]+$/.test(value);

const extractArticle = (payload: any) => {
  if (!payload) return null;
  if (payload.data && typeof payload.data === "object") return payload.data;
  return payload;
};

async function fetchArticleDetail(slug: string, lang: string) {
  const bySlugQuery = buildQuery(lang);

  try {
    const payload = await apiFetch(`/api/articles/slug/${encodeURIComponent(slug)}${bySlugQuery}`);
    const article = extractArticle(payload);
    if (article) return article;
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 404) {
      throw error;
    }
  }

  if (isNumericSlug(slug)) {
    try {
      const payload = await apiFetch(`/api/articles/${encodeURIComponent(slug)}${buildQuery(lang)}`);
      const article = extractArticle(payload);
      if (article) return article;
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 404) {
        throw error;
      }
    }
  }

  try {
    const listPayload = await apiFetch(`/api/articles?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`);
    const candidates =
      Array.isArray(listPayload?.data) ? listPayload.data :
      Array.isArray(listPayload?.items) ? listPayload.items :
      Array.isArray(listPayload?.records) ? listPayload.records :
      Array.isArray(listPayload?.data?.data) ? listPayload.data.data :
      [];
    const found = candidates.find((item: any) => (item?.slug ?? item?.slug_id) === slug);
    if (found) return found;
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 404) {
      throw error;
    }
  }

  throw new HttpError(404, "Article not found", null);
}

export function useArticleDetail(slug: string, lang: string) {
  return useQuery({
    queryKey: ["article-detail", slug, lang],
    queryFn: () => fetchArticleDetail(slug, lang),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      if (error instanceof HttpError && error.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
