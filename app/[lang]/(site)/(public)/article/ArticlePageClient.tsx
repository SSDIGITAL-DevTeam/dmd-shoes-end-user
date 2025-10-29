"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";

import Container from "@/components/ui-custom/Container";
import ArticleList from "./_components/ArticleList";
import ArticlePagination from "./_components/ArticlePagination";
import enDictionary from "@/dictionaries/article/en.json";
import idDictionary from "@/dictionaries/article/id.json";
import type { Article, Pagination } from "@/services/types";
import { inter } from "@/config/font";
import { useLatestArticle } from "@/hooks/useLatestArticle";
import type { Locale } from "@/i18n-config";

const PER_PAGE = 6;

const resolveDictionary = (lang: string) =>
  lang.startsWith("id") ? idDictionary : enDictionary;

const asString = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;

const formatPublishedDate = (value?: string, locale = "id") => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return new Intl.DateTimeFormat(locale.startsWith("id") ? "id-ID" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return value;
  }
};

type ArticlePageClientProps = {
  lang: Locale;
};

export default function ArticlePageClient({ lang }: ArticlePageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dictionary = resolveDictionary(lang);

  const initialSearch = useMemo(
    () => searchParams?.get("search") ?? "",
    [searchParams],
  );
  const initialPage = useMemo(() => {
    const raw = searchParams?.get("page");
    const parsed = raw ? Number(raw) : 1;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [meta, setMeta] = useState<Pagination<Article> | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [articlesPreview, setArticlesPreview] = useState<Article[]>([]);
  const [isPending, startTransition] = useTransition();

  const { data: latest } = useLatestArticle(lang);

  useEffect(() => {
    setSearchTerm(initialSearch);
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setMeta(null);
  }, [searchTerm]);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const updateUrl = useCallback(
    (nextPage: number, nextSearch: string) => {
      const nextParams = new URLSearchParams();
      if (nextSearch.trim()) nextParams.set("search", nextSearch.trim());
      if (nextPage > 1) nextParams.set("page", String(nextPage));
      const qs = nextParams.toString();
      startTransition(() => {
        router.replace(`/${lang}/article${qs ? `?${qs}` : ""}`, {
          scroll: false,
        });
      });
    },
    [router, lang],
  );

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextSearch = searchInput.trim();
      setSearchTerm(nextSearch);
      setPage(1);
      updateUrl(1, nextSearch);
    },
    [searchInput, updateUrl],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (nextPage === page || nextPage < 1) return;
      setPage(nextPage);
      updateUrl(nextPage, searchTerm);
    },
    [page, searchTerm, updateUrl],
  );

  const hasAnyArticles = (meta?.total ?? articlesPreview.length) > 0;

  const heroArticle = hasAnyArticles
    ? (latest ?? articlesPreview[0] ?? null)
    : null;

  const heroImage = asString((heroArticle as any)?.cover_url);
  const heroTitle = asString(heroArticle?.title);
  const heroSubtitle = asString(heroArticle?.subtitle ?? heroArticle?.excerpt);
  const heroAuthor = asString((heroArticle as any)?.author_name);
  const heroSlug = asString((heroArticle as any)?.slug);
  const heroSlugId = asString((heroArticle as any)?.slug_id);
  const heroHref =
    heroSlug || heroSlugId
      ? `/${lang}/article/${heroSlug ?? heroSlugId}`
      : `/${lang}/article`;

  const rawDateTime = asString(heroArticle?.published_at);
  const heroDate = formatPublishedDate(rawDateTime, lang);

  useEffect(() => {
    if (!heroImage && heroArticle && typeof heroArticle === "object") {
      const firstImage =
        asString((heroArticle as any)?.header_image_url) ??
        asString((heroArticle as any)?.thumbnail_url);
      if (firstImage) {
        (heroArticle as any).cover = {
          url: firstImage,
        };
      }
    }
  }, [heroArticle, heroImage]);

  const relatedArticles = useMemo(() => {
    if (!heroArticle) return [];

    return articlesPreview
      .filter((article) => {
        const currentSlug = asString((article as any)?.slug);
        const currentSlugId = asString((article as any)?.slug_id);
        return (
          currentSlug !== (heroSlug ?? heroSlugId) &&
          currentSlugId !== (heroSlug ?? heroSlugId)
        );
      })
      .slice(0, 6);
  }, [articlesPreview, heroArticle, heroSlug, heroSlugId]);

  const isBusy = isFetching || isPending;

  const currentPage = page;
  const totalPages = meta?.last_page ?? 1;

  return (
    <div className={`${inter.className} bg-[#F5F5F5]`}>
      <main>
        <section aria-labelledby="articles-header">
          <Container className="py-6 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1
                id="articles-header"
                className="text-primary font-semibold text-[32px] leading-[140%]"
              >
                {dictionary.title ||
                  (lang.startsWith("en") ? "Articles" : "Artikel")}
              </h1>

              <form
                onSubmit={handleSearchSubmit}
                className="relative rounded-lg w-full sm:w-[360px]"
                role="search"
                aria-label={
                  dictionary.search_label ||
                  (lang.startsWith("en") ? "Search articles" : "Cari artikel")
                }
              >
                <label htmlFor="article-search" className="sr-only">
                  {dictionary.search_label ||
                    (lang.startsWith("en") ? "Search" : "Pencarian")}
                </label>
                <AiOutlineSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                />
                <input
                  id="article-search"
                  type="search"
                  inputMode="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    dictionary.search_placeholder ||
                    (lang.startsWith("en")
                      ? "Search articles..."
                      : "Cari artikel...")
                  }
                  className="h-[44px] w-full rounded-lg border border-[#003663] bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
                />
                <button type="submit" className="sr-only">
                  {dictionary.search_label ||
                    (lang.startsWith("en") ? "Search" : "Cari")}
                </button>
              </form>
            </div>
          </Container>
        </section>

        {heroArticle ? (
          <section
            aria-labelledby="featured-article"
            className="relative h-[380px] bg-black sm:h-[440px]"
          >
            {heroImage ? (
              <Image
                src={heroImage}
                alt={heroTitle || "featured"}
                fill
                priority
                className="object-cover object-center opacity-90"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-900" />
            )}
            <div className="absolute inset-0 bg-black/55" aria-hidden />
            <Container className="relative z-10 h-full">
              <div className="flex h-full items-center">
                <div className="max-w-xl rounded-lg bg-white p-6 shadow-md sm:p-8">
                  {heroDate ? (
                    <p className="mb-2 text-[13px] leading-5 text-gray-500">
                      <time dateTime={rawDateTime}>{heroDate}</time>
                      {heroAuthor ? (
                        <>
                          {" · "}
                          <span>{heroAuthor}</span>
                        </>
                      ) : null}
                    </p>
                  ) : null}

                  {heroTitle ? (
                    <h2
                      id="featured-article"
                      className="mb-4 line-clamp-3 text-[28px] font-semibold leading-tight text-[#121212] sm:text-[34px]"
                    >
                      {heroTitle}
                    </h2>
                  ) : null}

                  {heroSubtitle ? (
                    <p className="line-clamp-3 text-sm text-gray-600">
                      {heroSubtitle}
                    </p>
                  ) : null}

                  <Link
                    href={heroHref}
                    prefetch={false}
                    className="mt-4 inline-flex items-center gap-1 border-b border-[#003663] pb-0.5 text-sm font-semibold text-[#003663] transition-opacity hover:opacity-80 disabled:opacity-50 sm:text-base"
                    aria-label={`${dictionary.hero_cta}${
                      heroTitle ? `: ${heroTitle}` : ""
                    }`}
                  >
                    {dictionary.hero_cta}
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        ) : null}

        <section aria-labelledby="all-articles">
          <Container className="py-8 sm:py-10">
            <h2 id="all-articles" className="sr-only">
              {dictionary.title}
            </h2>

            <ArticleList
              lang={lang}
              page={currentPage}
              perPage={PER_PAGE}
              search={searchTerm}
              dictionary={dictionary}
              onMetaChange={setMeta}
              onLoadingChange={setIsFetching}
              onDataResolved={setArticlesPreview}
            />
          </Container>
        </section>

        {hasAnyArticles && totalPages > 1 ? (
          <Container className="pb-12">
            <ArticlePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
              dictionary={{ prev: dictionary.prev, next: dictionary.next }}
              disabled={isBusy}
            />
          </Container>
        ) : null}

        {/* RELATED (opsional): render hanya jika ada hero & ada related */}
        {/* {heroArticle && relatedArticles.length > 0 ? ( ... ) : null} */}
      </main>
    </div>
  );
}
