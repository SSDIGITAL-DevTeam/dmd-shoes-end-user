import { apiFetch, buildQueryString } from "@/lib/api-client";
import type { ApiResponse, MetaKeyValue, MetaPage, MetaTag } from "@/services/types";

type MetaPagesResponse = ApiResponse<MetaPage[]>;
type MetaTagsResponse = ApiResponse<MetaTag[]> & {
  page?: MetaPage;
  locale?: string;
};
type MetaKeyValueResponse = ApiResponse<MetaKeyValue> & {
  page?: MetaPage;
  locale?: string;
};

const pages = async (): Promise<MetaPage[]> => {
  const response = await apiFetch<MetaPagesResponse>("/meta/pages");
  return Array.isArray(response.data) ? response.data : [];
};

const pageTags = async (page: string | number, locale?: string): Promise<MetaTag[]> => {
  const query = buildQueryString({ locale });
  const response = await apiFetch<MetaTagsResponse>(
    `/meta/pages/${encodeURIComponent(String(page))}/tags${query}`,
  );
  return Array.isArray(response.data) ? response.data : [];
};

const allKeyValue = async (page: string | number, locale?: string): Promise<MetaKeyValue> => {
  const query = buildQueryString({ locale });
  const response = await apiFetch<MetaKeyValueResponse>(
    `/meta/pages/${encodeURIComponent(String(page))}/tags/all${query}`,
  );
  return response.data ?? {};
};

const publicBySlug = async (slug: string, locale?: string): Promise<MetaKeyValue> => {
  const query = buildQueryString({ locale });
  const response = await apiFetch<MetaKeyValueResponse>(
    `/meta/public/${encodeURIComponent(slug)}${query}`,
  );
  return response.data ?? {};
};

export const MetaService = {
  pages,
  pageTags,
  allKeyValue,
  publicBySlug,
};

export type MetaServiceType = typeof MetaService;
