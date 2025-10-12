"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";

import Container from "@/components/ui-custom/Container";
import ArticleList from "./_components/ArticleList";
import ArticlePagination from "./_components/ArticlePagination";
import ArticleSlider from "./_components/ArticleSlider";
import enDictionary from "@/dictionaries/article/en.json";
import idDictionary from "@/dictionaries/article/id.json";
import type { Article, Pagination } from "@/services/types";

const PER_PAGE = 12;
const FALLBACK_COVER = "/assets/demo/article/article-header.webp";

// ---------- helpers ----------
const resolveLang = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  return "id";
};

const resolveDictionary = (lang: string) => (lang.startsWith("id") ? idDictionary : enDictionary);

// pastikan benar-benar string sebelum dipakai di prop yang butuh string
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

export default function ArticlePage() {
  const params = useParams<{ lang?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = resolveLang(params?.lang);
  const dictionary = resolveDictionary(lang);

  const initialSearch = useMemo(() => searchParams?.get("search") ?? "", [searchParams]);
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

  useEffect(() => {
    setSearchTerm(initialSearch);
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const updateUrl = useCallback(
    (nextPage: number, nextSearch: string) => {
      const nextParams = new URLSearchParams();
      if (nextSearch.trim()) nextParams.set("search", nextSearch.trim());
      if (nextPage > 1) nextParams.set("page", String(nextPage));
      const queryString = nextParams.toString();
      startTransition(() => {
        router.replace(`/${lang}/article${queryString ? `?${queryString}` : ""}`, { scroll: false });
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

  // ---------- hero (type-safe derived) ----------
  const heroArticle = articlesPreview[0] ?? null;

  const heroImage =
    asString(heroArticle?.cover_url) ??
    asString(heroArticle?.cover) ??
    FALLBACK_COVER;

  const heroTitle =
    asString(heroArticle?.title) ??
    asString((heroArticle as any)?.title_text) ?? // kalau BE kirim title_text
    dictionary.hero_title;

  const heroSubtitle =
    asString((heroArticle as any)?.excerpt) ??
    dictionary.hero_subtitle;

  const heroHref = heroArticle
    ? `/${lang}/article/${asString(heroArticle.slug) ?? String(heroArticle.id)}`
    : "#";

  const rawDateTime =
    asString(heroArticle?.published_at) ??
    asString(heroArticle?.created_at);

  const heroDate = formatPublishedDate(rawDateTime, lang);
  const heroAuthor = asString(heroArticle?.author_name);

  const relatedArticles = useMemo(() => {
    if (!heroArticle) return articlesPreview.slice(1, 7);
    const currentKey = asString(heroArticle.slug) ?? heroArticle.id;
    return articlesPreview
      .filter((a) => (asString(a.slug) ?? a.id) !== currentKey)
      .slice(0, 6);
  }, [articlesPreview, heroArticle]);

  const isBusy = isFetching || isPending;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="border-b border-black/5 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <Container className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold leading-tight text-[#003663] sm:text-3xl">
              {dictionary.title}
            </h1>

            <form role="search" className="relative w-full sm:w-[360px]" onSubmit={handleSearchSubmit}>
              <label htmlFor="article-search" className="sr-only">
                {dictionary.search_label}
              </label>
              <AiOutlineSearch
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="article-search"
                type="search"
                inputMode="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={dictionary.search_placeholder}
                className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm leading-none outline-none focus:border-[#003663] focus:ring-2 focus:ring-[#003663]/25"
              />
            </form>
          </div>
        </Container>
      </header>

      <main>
        {/* HERO */}
        <section aria-labelledby="featured-article" className="relative h-[380px] bg-black sm:h-[440px]">
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            priority
            className="object-cover object-center opacity-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />

          <Container className="relative z-10 h-full">
            <div className="flex h-full items-center">
              <div className="max-w-xl rounded-lg bg-white p-6 shadow-md sm:p-8">
                {heroDate ? (
                  <p className="mb-2 text-[13px] leading-5 text-gray-500">
                    {/* dateTime harus string | undefined */}
                    <time dateTime={rawDateTime}>{heroDate}</time>
                    {heroAuthor ? (
                      <>
                        {" · "}
                        <span>{heroAuthor}</span>
                      </>
                    ) : null}
                  </p>
                ) : null}

                <h2
                  id="featured-article"
                  className="mb-4 line-clamp-3 text-[28px] font-semibold leading-tight text-[#121212] sm:text-[34px]"
                >
                  {heroTitle}
                </h2>

                <p className="line-clamp-3 text-sm text-gray-600">{heroSubtitle}</p>

                <Link
                  href={heroHref}
                  prefetch={false}
                  className="mt-4 inline-flex items-center gap-1 border-b border-[#003663] pb-0.5 text-sm font-semibold text-[#003663] transition-opacity hover:opacity-80 disabled:opacity-50 sm:text-base"
                  aria-label={`${dictionary.hero_cta}: ${heroTitle}`}
                >
                  {dictionary.hero_cta}
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* LIST */}
        <section aria-labelledby="all-articles">
          <Container className="py-8 sm:py-10">
            <h2 id="all-articles" className="sr-only">
              {dictionary.title}
            </h2>

            <ArticleList
              lang={lang}
              page={page}
              perPage={PER_PAGE}
              search={searchTerm}
              dictionary={dictionary}
              onMetaChange={(metaValue) => setMeta(metaValue)}
              onLoadingChange={setIsFetching}
              onDataResolved={setArticlesPreview}
            />
          </Container>
        </section>

        <Container className="pb-12">
          <ArticlePagination
            currentPage={meta?.current_page ?? page}
            totalPages={meta?.last_page ?? 1}
            onChange={handlePageChange}
            dictionary={{ prev: dictionary.prev, next: dictionary.next }}
            disabled={isBusy}
          />
        </Container>

        {/* RELATED */}
        <section aria-labelledby="related-articles" className="pb-16">
          <h2 id="related-articles" className="sr-only">
            {dictionary.related}
          </h2>
          <ArticleSlider
            articles={relatedArticles}
            lang={lang}
            readMoreLabel={dictionary.read_more_button}
          />
        </section>
      </main>
    </div>
  );
}
