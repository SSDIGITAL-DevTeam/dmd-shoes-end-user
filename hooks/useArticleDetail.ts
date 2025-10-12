"use client";

import { useQuery } from "@tanstack/react-query";
import { ArticleService } from "@/services/article.service";
import { queryKeys } from "@/lib/query-keys";

export const useArticleDetail = (slug: string, lang?: string) =>
  useQuery({
    queryKey: queryKeys.articles.detailBySlug(slug, lang),
    queryFn: () => ArticleService.showBySlug(slug, lang ? { lang } : {}),
    staleTime: 60_000,
    enabled: Boolean(slug),
  });
