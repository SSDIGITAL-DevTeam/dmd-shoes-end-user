"use client";

import { useQuery } from "@tanstack/react-query";
import { listArticles, type ListArticlesParams } from "@/services/article.service";

/**
 * Hook untuk mengambil daftar artikel dengan pagination + pencarian.
 * - queryKey memasukkan lang, page, per_page, dan term agar re-fetch saat berubah
 * - Jika term kosong → tidak diikutkan ke request
 */
export function useArticles(params: ListArticlesParams) {
  const {
    lang,
    page = 1,
    per_page = 12,
    search,
    q,
    keyword,
    query,
    title,
  } = params;

  // Ambil term pertama yang string & non-empty
  const raw =
    (typeof search === "string" && search) ||
    (typeof q === "string" && q) ||
    (typeof keyword === "string" && keyword) ||
    (typeof query === "string" && query) ||
    (typeof title === "string" && title) ||
    "";

  const term = raw.trim();

  return useQuery({
    queryKey: ["articles", lang ?? "", page, per_page, term],
    queryFn: () =>
      listArticles(
        term
          ? { lang, page, per_page, search: term } // kirim search hanya jika ada
          : { lang, page, per_page }               // tanpa search bila kosong
      ),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
