import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/env";

/** Ubah sesuai backend-mu kalau path by-slug beda */
const TRY_PATHS = (slug: string, lang: string) => [
  // 1) publik by-slug (contoh)
  `${API_URL}/public/articles/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`,
  // 2) alternatif by-slug lain (comment kalau gak ada)
  `${API_URL}/articles/by-slug/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`,
];

function isLikelyId(v: string) {
  return /^[0-9]+$/.test(v);
}

async function fetchArticleDetail(slug: string, lang: string) {
  // --- 1) Coba endpoint by-slug yang ada ---
  for (const url of TRY_PATHS(slug, lang)) {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const js = await res.json().catch(() => ({}));
      // banyak backend wrap di {data: {...}}
      return js?.data ?? js;
    }
    if (res.status === 404) continue; // coba path berikutnya
    // kalau error 5xx/4xx lain, terus coba cara lain; jangan langsung throw
  }

  // --- 2) Kalau slug angka, coba by-id ---
  if (isLikelyId(slug)) {
    const byId = await fetch(`${API_URL}/articles/${slug}?lang=${encodeURIComponent(lang)}`, { cache: "no-store" });
    if (byId.ok) {
      const js = await byId.json().catch(() => ({}));
      return js?.data ?? js;
    }
  }

  // --- 3) Fallback cari dari list (filter ?slug=...) ---
  const q = new URLSearchParams({ slug, lang }).toString();
  const list = await fetch(`${API_URL}/articles?${q}`, { cache: "no-store" });
  if (list.ok) {
    const js = await list.json().catch(() => ({}));
    const arr =
      Array.isArray(js?.data) ? js.data :
        Array.isArray(js?.items) ? js.items :
          Array.isArray(js?.records) ? js.records :
            Array.isArray(js?.data?.data) ? js.data.data : [];
    const found = arr.find((a: any) => (a?.slug ?? a?.slug_id) === slug);
    if (found) return found;
  }

  throw new Error("Artikel tidak ditemukan");
}

export function useArticleDetail(slug: string, lang: string) {
  return useQuery({
    queryKey: ["article-detail", slug, lang],
    queryFn: () => fetchArticleDetail(slug, lang),
    enabled: Boolean(slug),
    retry: 1,
  });
}
