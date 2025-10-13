"use client";

import { useQuery } from "@tanstack/react-query";
import { listArticles, type ListArticlesParams } from "@/services/article.service";

export function useArticles(params: ListArticlesParams) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => listArticles(params),
    // v5: ganti keepPreviousData -> placeholderData agar transisi halus
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
