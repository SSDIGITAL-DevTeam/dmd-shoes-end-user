import { apiFetch, buildQueryString } from "@/lib/api-client";
import type {
  ApiResponse,
  Pagination,
  ProductCard,
  ProductDetail,
} from "@/services/types";

type ProductListResponse = ApiResponse<ProductCard[]> & {
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    [key: string]: unknown;
  };
};

type CategoryRangeMeta = {
  id: number;
  name?: string | null;
  min?: number | null;
  max?: number | null;
};

type RangeMeta = {
  min?: number | null;
  max?: number | null;
  categories?: CategoryRangeMeta[];
};

type FilterMetaResponse = ApiResponse<{
  heel_height_cm?: RangeMeta;
  size_eu?: RangeMeta;
}>;

export type ProductFilterMetaQuery = {
  lang?: string;
  category_ids?: string;
};

export type ProductListQuery = {
  lang?: string;
  search?: string;
  category_ids?: string;
  featured?: boolean;
  heel_min?: number;
  heel_max?: number;
  size_min?: number;
  size_max?: number;
  page?: number;
  per_page?: number;
  sort?: string;
  dir?: "asc" | "desc";
  view?: "card" | "full";
};

const toPagination = (
  response: ProductListResponse,
  fallback: { page?: number; perPage?: number } = {},
): Pagination<ProductCard> => {
  const items = Array.isArray(response?.data) ? response.data : [];
  const meta = response.meta;
  const currentPage = meta?.current_page ?? fallback.page ?? 1;
  const perPage =
    meta?.per_page ?? fallback.perPage ?? (items.length > 0 ? items.length : 10);
  const total = meta?.total ?? items.length;
  const lastPage =
    meta?.last_page ?? Math.max(1, Math.ceil(total / (perPage || 1)));

  return {
    data: items,
    current_page: currentPage,
    per_page: perPage,
    total,
    last_page: lastPage,
  };
};

const getFilterMeta = async (params?: ProductFilterMetaQuery) => {
  const query = buildQueryString({
    lang: params?.lang,
    category_ids: params?.category_ids,
  });
  const response = await apiFetch<FilterMetaResponse>(
    `/products/filters/meta${query}`,
  );
  return response.data ?? {
    heel_height_cm: undefined,
    size_eu: undefined,
  };
};

const list = async (params: ProductListQuery = {}): Promise<Pagination<ProductCard>> => {
  const view = params.view ?? "card";
  const query = buildQueryString({
    lang: params.lang,
    search: params.search,
    category_ids: params.category_ids,
    featured:
      params.featured === undefined
        ? undefined
        : params.featured
          ? 1
          : 0,
    heel_min: params.heel_min,
    heel_max: params.heel_max,
    size_min: params.size_min,
    size_max: params.size_max,
    page: params.page,
    per_page: params.per_page,
    sort: params.sort,
    dir: params.dir,
    view,
  });

  const response = await apiFetch<ProductListResponse>(`/products${query}`);
  return toPagination(response, {
    page: params.page,
    perPage: params.per_page,
  });
};

const detailBySlug = async (slug: string, lang?: string): Promise<ProductDetail> => {
  const query = buildQueryString({ lang });
  const response = await apiFetch<ApiResponse<ProductDetail>>(
    `/products/slug/${encodeURIComponent(slug)}${query}`,
  );

  if (!response.data) {
    throw new Error("Product detail payload missing.");
  }

  return response.data;
};

export const ProductService = {
  getFilterMeta,
  list,
  detailBySlug,
};

export type ProductServiceType = typeof ProductService;
