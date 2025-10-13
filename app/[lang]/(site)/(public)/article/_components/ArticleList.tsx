"use client";

import { useEffect, useMemo, useRef } from "react";
import { useArticles } from "@/hooks/useArticles";
import type { ListArticlesParams } from "@/services/article.service";
import type { Article, Pagination } from "@/services/types";
import ArticleItem from "./ArticleItem";

/* -------------------------------- helpers -------------------------------- */

const buildParams = (params: {
  page: number;
  perPage: number;
  search?: string;
  lang: string;
}): ListArticlesParams => {
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

// bandingkan daftar artikel via id/slug
function shallowEqualById(a: Article[], b: Article[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if ((a[i]?.id ?? (a[i] as any)?.slug) !== (b[i]?.id ?? (b[i] as any)?.slug)) return false;
  }
  return true;
}

const toNumber = (v: unknown, fb = 0) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : fb;
};

// apakah object tampak seperti carrier paginator
const hasPaginatorKeys = (o: any) =>
  o &&
  (o.current_page !== undefined ||
    o.currentPage !== undefined ||
    o.last_page !== undefined ||
    o.lastPage !== undefined ||
    o.total !== undefined ||
    o.totalItems !== undefined ||
    o.per_page !== undefined ||
    o.perPage !== undefined ||
    o.limit !== undefined);

// Ambil objek meta: root, .meta, .pagination, atau .data (objek paginator Laravel)
const pickMetaCarrier = (raw: any) => {
  if (!raw) return {};
  if (raw.meta && hasPaginatorKeys(raw.meta)) return raw.meta;
  if (raw.pagination && hasPaginatorKeys(raw.pagination)) return raw.pagination;
  if (raw.data && !Array.isArray(raw.data) && hasPaginatorKeys(raw.data)) return raw.data; // Laravel: data:{...meta..., data:[...]}
  return raw;
};

// Ambil array data: raw.data (array), raw.items, raw.records, atau raw.data.data (Laravel)
const pickDataArray = (raw: any): any[] => {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.records)) return raw.records;
  if (raw?.data && Array.isArray(raw?.data?.data)) return raw.data.data; // Laravel
  return [];
};

const normalizeMeta = (raw: any): Pagination<Article> => {
  const carrier = pickMetaCarrier(raw);
  const data = pickDataArray(raw);

  const per_page =
    toNumber(carrier?.per_page ?? carrier?.perPage ?? carrier?.limit, 12) || 12;

  const total =
    toNumber(carrier?.total ?? carrier?.total_items ?? carrier?.totalItems, data.length) ||
    data.length;

  const last_page =
    toNumber(
      carrier?.last_page ??
      carrier?.lastPage ??
      Math.max(1, Math.ceil(total / Math.max(per_page, 1))),
      1
    ) || 1;

  const current_page =
    toNumber(carrier?.current_page ?? carrier?.currentPage ?? 1, 1) || 1;

  return { current_page, per_page, total, last_page, data } as Pagination<Article>;
};

/* ------------------------------- component ------------------------------- */

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
  const params = useMemo(
    () => buildParams({ lang, page, perPage, search }),
    [lang, page, perPage, search]
  );

  const query = useArticles(params);
  const { data: rawData, isError, isLoading, isFetching, refetch } = query;

  const normalized = useMemo(() => (rawData ? normalizeMeta(rawData) : null), [rawData]);
  const articles = useMemo<Article[]>(
    () => (normalized?.data ?? []) as Article[],
    [normalized?.data]
  );

  const isBusy = isLoading || isFetching;

  useEffect(() => {
    onLoadingChange?.(isBusy);
  }, [isBusy, onLoadingChange]);

  const lastMetaRef = useRef<Pagination<Article> | null>(null);
  useEffect(() => {
    if (!normalized || !onMetaChange) return;
    const prev = lastMetaRef.current;
    const changed =
      !prev ||
      prev.current_page !== normalized.current_page ||
      prev.last_page !== normalized.last_page ||
      prev.total !== normalized.total ||
      prev.per_page !== normalized.per_page;

    if (changed) {
      onMetaChange(normalized);
      lastMetaRef.current = normalized;
    }
  }, [normalized, onMetaChange]);

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
            key={`${(article as any)?.slug ?? (article as any)?.id}`}
            article={article}
            lang={lang}
            readMoreLabel={dictionary.read_more}
          />
        ))}
    </div>
  );
}

export default ArticleList;
