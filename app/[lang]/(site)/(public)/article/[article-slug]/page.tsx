"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/ui-custom/Container";
import ArticleSlider from "../_components/ArticleSlider";
import { useArticleDetail } from "@/hooks/useArticleDetail";
import { useArticles } from "@/hooks/useArticles";
import enDictionary from "@/dictionaries/article/en.json";
import idDictionary from "@/dictionaries/article/id.json";
import type { Article } from "@/services/types";

const FALLBACK_COVER = "/assets/demo/article/article-item.webp";

// ---- helpers ---------------------------------------------------------------
const resolveLang = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  return "id";
};

const resolveDictionary = (lang: string) =>
  lang.startsWith("id") ? idDictionary : enDictionary;

const asString = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined;

const formatPublishedDate = (value?: string, locale = "id") => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  try {
    return new Intl.DateTimeFormat(
      locale.startsWith("id") ? "id-ID" : "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    ).format(date);
  } catch {
    return value;
  }
};

const formatContent = (raw?: string | null) => {
  if (!raw) return "";
  const escaped = raw.trim();
  if (!escaped) return "";

  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, "<br />").trim())
    .filter(Boolean);

  if (!paragraphs.length) return `<p>${escaped}</p>`;
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
};

const filterRelatedArticles = (articles: Article[], current: Article | null) => {
  if (!articles.length) return [];
  const currentKey = current ? current.slug ?? current.id : null;
  return articles
    .filter((a) => (a.slug ?? a.id) !== currentKey)
    .slice(0, 6);
};

// ---- page ------------------------------------------------------------------
export default function ArticleDetailPage() {
  const params = useParams<{ lang?: string; "article-slug"?: string }>();
  const router = useRouter();
  const lang = resolveLang(params?.lang);
  const dictionary = resolveDictionary(lang);

  const slugParam = params?.["article-slug"] ?? "";
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const { data: article, isLoading, isError } = useArticleDetail(slug, lang);

  const relatedParams = useMemo(
    () => ({ page: 1, per_page: 6, lang }),
    [lang],
  );
  const relatedQuery = useArticles(relatedParams);
  const relatedArticles = useMemo(
    () => filterRelatedArticles(relatedQuery.data?.data ?? [], article ?? null),
    [relatedQuery.data, article],
  );

  if (!slug) {
    router.replace(`/${lang}/article`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Container className="py-16 text-center text-gray-500">
          {dictionary.loading}
        </Container>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Container className="py-16 text-center text-gray-500">
          {dictionary.error}
        </Container>
      </div>
    );
  }

  // ---- SAFE derived values -------------------------------------------------
  const titleText =
    asString(article.title_text) ?? asString(article.title) ?? "";

  const contentText = asString(article.content_text) ?? "";
  const contentHtml = formatContent(contentText);

  const cover =
    asString(article.cover_url) ??
    asString(article.cover) ??
    FALLBACK_COVER;

  const rawDateTime =
    asString(article.published_at) ?? asString(article.created_at);

  const publishedLabel = formatPublishedDate(rawDateTime, lang);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Container className="mx-auto w-full max-w-2xl px-4 py-8 sm:max-w-3xl md:max-w-4xl sm:py-10">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="font-medium text-primary hover:opacity-80">
                  {dictionary.breadcrumb_home}
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li>
                <Link href={`/${lang}/article`} className="font-medium text-primary hover:opacity-80">
                  {dictionary.breadcrumb_articles}
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li className="text-gray-500">
                <span aria-current="page" className="line-clamp-1">
                  {titleText}
                </span>
              </li>
            </ol>
          </nav>

          {/* article */}
          <article>
            <header className="mb-3">
              <h1 className="text-[28px] font-bold leading-tight text-[#003663] sm:text-[34px]">
                {titleText}
              </h1>

              <p className="mt-2 flex flex-wrap gap-2 text-sm text-[#003663]/90">
                {asString(article.author_name) ? (
                  <span className="font-medium">
                    {dictionary.by_author.replace("{{author}}", article.author_name as string)}
                  </span>
                ) : null}
                {asString(article.author_name) && publishedLabel ? <span>·</span> : null}
                {publishedLabel ? (
                  <time dateTime={rawDateTime}>{publishedLabel}</time>
                ) : null}
              </p>
            </header>

            <figure className="relative mb-6 h-[240px] overflow-hidden rounded-lg bg-black/5 sm:h-[320px] md:h-[420px]">
              <Image
                src={cover}
                alt={titleText || "Article cover"}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </figure>

            <div className="prose prose-neutral max-w-none text-gray-700 prose-h2:mt-6 prose-h2:text-xl prose-h2:font-bold">
              {contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              ) : (
                <p>{dictionary.content_empty}</p>
              )}
            </div>
          </article>

          {/* related */}
          <section aria-labelledby="related-articles" className="pt-10">
            <h2 id="related-articles" className="mb-4 text-lg font-bold text-[#121212]">
              {dictionary.related}
            </h2>
            <ArticleSlider
              articles={relatedArticles}
              lang={lang}
              readMoreLabel={dictionary.read_more_button}
            />
          </section>
        </Container>
      </main>
    </div>
  );
}
