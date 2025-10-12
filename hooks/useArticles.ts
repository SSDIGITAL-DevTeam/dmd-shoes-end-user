"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArticleService, type ListArticlesParams } from "@/services/article.service";
import { queryKeys } from "@/lib/query-keys";

export const useArticles = (params: ListArticlesParams) =>
  useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => ArticleService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
