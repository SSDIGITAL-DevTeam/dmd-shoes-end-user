"use client";

import { useQuery } from "@tanstack/react-query";
import { latestArticle } from "@/services/article.service";

export function useLatestArticle(lang?: string) {
    return useQuery({
        queryKey: ["articles", "latest", lang ?? "id"],
        queryFn: () => latestArticle({ lang }),
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}
