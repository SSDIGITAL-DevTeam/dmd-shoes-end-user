import { apiFetch, buildQueryString } from "@/lib/api-client";
import type {
  ApiResponse,
  HomepageContent,
  Category,
  ProductCard,
} from "@/services/types";

export type HomeBootstrapResponse = {
  homepage: HomepageContent;
  categories: Category[];
  featured_products: ProductCard[];
};

export type HomeBootstrapParams = {
  lang: string;
  featuredPerPage?: number;
  categoriesPerPage?: number;
};

const home = async ({
  lang,
  featuredPerPage,
  categoriesPerPage,
}: HomeBootstrapParams): Promise<HomeBootstrapResponse> => {
  const query = buildQueryString({
    lang,
    featured_per_page: featuredPerPage,
    categories_per_page: categoriesPerPage,
  });

  const isServer = typeof window === "undefined";

  const response = await apiFetch<ApiResponse<HomeBootstrapResponse>>(
    `/site/bootstrap/home${query}`,
    isServer
      ? {
          cache: "force-cache",
          next: { revalidate: 60 },
        }
      : undefined,
  );

  if (!response.data) {
    throw new Error("Bootstrap payload missing");
  }

  return response.data;
};

export const BootstrapService = {
  home,
};
