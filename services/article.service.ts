import { apiFetch, buildQueryString } from "@/lib/api-client";
import type { ApiResponse, Article, Pagination } from "@/services/types";

type ArticleListResponse = ApiResponse<Article[]> & {
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    [key: string]: unknown;
  };
};

export type ArticleListQuery = {
  lang?: string;
  status?: "publish" | "draft";
  page?: number;
  per_page?: number;
  search?: string;
};

const list = async (
  params: ArticleListQuery = {},
): Promise<Pagination<Article>> => {
  const query = buildQueryString({
    lang: params.lang,
    status: params.status,
    page: params.page,
    per_page: params.per_page,
    search: params.search,
  });

  const response = await apiFetch<ArticleListResponse>(`/articles${query}`);
  const items = Array.isArray(response.data) ? response.data : [];
  const meta = response.meta ?? {};

  return {
    data: items,
    current_page: meta.current_page ?? params.page ?? 1,
    per_page: meta.per_page ?? params.per_page ?? items.length,
    total: meta.total ?? items.length,
    last_page: meta.last_page ?? 1,
  };
};

export const ArticleService = {
  list,
};

export type ArticleServiceType = typeof ArticleService;
