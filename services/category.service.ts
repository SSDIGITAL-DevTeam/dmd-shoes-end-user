import { apiFetch, buildQueryString } from "@/lib/api-client";
import type { ApiResponse, Category, Pagination } from "@/services/types";

type CategoryListResponse = ApiResponse<Category[]> & {
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    [key: string]: unknown;
  };
};

export type CategoryListQuery = {
  lang?: string;
  status?: "active" | "inactive" | "all";
  parent_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
};

const list = async (
  params: CategoryListQuery = {},
): Promise<Pagination<Category>> => {
  const query = buildQueryString({
    lang: params.lang,
    status: params.status,
    parent_id: params.parent_id,
    search: params.search,
    page: params.page,
    per_page: params.per_page,
  });

  const response = await apiFetch<CategoryListResponse>(
    `/categories${query}`,
  );

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

export const CategoryService = {
  list,
};

export type CategoryServiceType = typeof CategoryService;
