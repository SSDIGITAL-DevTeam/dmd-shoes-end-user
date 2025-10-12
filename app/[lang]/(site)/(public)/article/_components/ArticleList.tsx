"use client";

import { useEffect, useMemo, useRef } from "react";
import { useArticles } from "@/hooks/useArticles";
import type { ListArticlesParams } from "@/services/article.service";
import type { Article, Pagination } from "@/services/types";
import ArticleItem from "./ArticleItem";

const buildParams = (params: { page: number; perPage: number; search?: string; lang: string }): ListArticlesParams => {
  const normalized: ListArticlesParams = {
    page: params.page,
    per_page: params.perPage,
    lang: params.lang,
  };
  if (params.search?.trim()) normalized.search = params.search.trim();
  return normalized;
};

type ArticleListDictionary = {
  read_more: string;
  empty: string;
  error: string;
  retry: string;
  loading: string;
};

type ArticleListProps = {
  lang: string;
  page: number;
  perPage: number;
  search?: string;
  dictionary: ArticleListDictionary;
  onMetaChange?: (meta: Pagination<Article>) => void;
  onLoadingChange?: (loading: boolean) => void;
  onDataResolved?: (articles: Article[]) => void;
};

const SkeletonCard = () => (
  <div className="relative bg-white shadow-sm overflow-visible animate-pulse">
    <div className="relative h-60 w-full bg-gray-200" />
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-white p-4 shadow-lg">
      <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-2/3 bg-gray-200 rounded mt-2" />
    </div>
  </div>
);

// helper: bandingkan daftar artikel via id
function shallowEqualById(a: Article[], b: Article[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if ((a[i]?.id ?? a[i]?.slug) !== (b[i]?.id ?? b[i]?.slug)) return false;
  }
  return true;
}

function ArticleList({
  lang,
  page,
  perPage,
  search,
  dictionary,
  onMetaChange,
  onLoadingChange,
  onDataResolved,
}: ArticleListProps) {
  const params = useMemo(() => buildParams({ lang, page, perPage, search }), [lang, page, perPage, search]);
  const query = useArticles(params);
  const { data, isError, isLoading, isFetching, refetch } = query;

  // Stabilkan referensi array agar tidak selalu "baru" di setiap render
  const articles = useMemo<Article[]>(() => data?.data ?? [], [data?.data]);

  const isBusy = isLoading || isFetching;

  // report loading state (stabil)
  useEffect(() => {
    onLoadingChange?.(isBusy);
  }, [isBusy, onLoadingChange]);

  // report meta hanya saat berubah signifikan
  const lastMetaRef = useRef<Pagination<Article> | null>(null);
  useEffect(() => {
    if (!data || !onMetaChange) return;
    const prev = lastMetaRef.current;
    const changed =
      !prev ||
      prev.current_page !== data.current_page ||
      prev.last_page !== data.last_page ||
      prev.total !== data.total ||
      prev.per_page !== data.per_page;
    if (changed) {
      onMetaChange(data);
      lastMetaRef.current = data;
    }
  }, [data, onMetaChange]);

  // report data hanya saat daftar artikel benar-benar berubah
  const lastArticlesRef = useRef<Article[] | null>(null);
  useEffect(() => {
    if (!onDataResolved) return;
    const prev = lastArticlesRef.current ?? [];
    if (!shallowEqualById(prev, articles)) {
      onDataResolved(articles);
      lastArticlesRef.current = articles;
    }
  }, [articles, onDataResolved]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        <p>{dictionary.error}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded border border-red-400 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-100"
        >
          {dictionary.retry}
        </button>
      </div>
    );
  }

  if (!articles.length && !isBusy) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
        {dictionary.empty}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 py-12">
      {isBusy
        ? Array.from({ length: perPage }, (_, index) => <SkeletonCard key={index} />)
        : articles.map((article) => (
          <ArticleItem
            key={`${article.slug ?? article.id}`}
            article={article}
            lang={lang}
            readMoreLabel={dictionary.read_more}
          />
        ))}
    </div>
  );
}

export default ArticleList;
