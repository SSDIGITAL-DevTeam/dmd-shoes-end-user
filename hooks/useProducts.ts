"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import type {
  Pagination,
  ProductCard,
  ProductDetail,
} from "@/services/types";
import type {
  ProductFilterMetaQuery,
  ProductListQuery,
} from "@/services/product.service";
import { queryKeys } from "@/lib/query-keys";

export type UseProductsParams = ProductListQuery;

export const useProducts = (params: UseProductsParams) => {
  const listQuery = useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => ProductService.list(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const filterParams: ProductFilterMetaQuery = useMemo(
    () => ({
      lang: params.lang,
      category_ids: params.category_ids,
    }),
    [params.category_ids, params.lang],
  );

  const filterQuery = useQuery({
    queryKey: queryKeys.products.filters(filterParams),
    queryFn: () => ProductService.getFilterMeta(filterParams),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    products: listQuery.data ?? ({ data: [], current_page: 1, per_page: 0, total: 0, last_page: 1 } satisfies Pagination<ProductCard>),
    filters: filterQuery.data,
    isLoading: listQuery.isLoading || filterQuery.isLoading,
    isFetching: listQuery.isFetching || filterQuery.isFetching,
    isError: listQuery.isError || filterQuery.isError,
    error: listQuery.error ?? filterQuery.error,
    refetch: listQuery.refetch,
  };
};

export const useProductDetail = (slug: string, lang?: string) =>
  useQuery({
    queryKey: queryKeys.products.detail(slug, lang),
    queryFn: () => ProductService.detailBySlug(slug, lang),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
