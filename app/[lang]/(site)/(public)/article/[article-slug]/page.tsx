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
import ArticleSchema from "@/app/seo/schema/ArticleSchema";
import BreadcrumbSchema from "@/app/seo/schema/BreadcumbSchema";
import { getAbsoluteUrl } from "@/lib/site";

const FALLBACK_COVER = "/assets/demo/article/article-item.webp";

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
      { year: "numeric", month: "long", day: "numeric" }
    ).format(date);
  } catch {
    return value;
  }
};

const formatContent = (raw?: string | null) => {
  if (!raw) return "";
  const html = raw.trim();
  if (!html) return "";

  // biarkan HTML TinyMCE apa adanya
  const looksLikeHtml = /<\/?(p|ul|ol|li|h[1-6]|br|strong|em|blockquote|a|img|figure|table)\b/i.test(
    html
  );
  if (looksLikeHtml) return html;

  const normalized = html.replace(/\r\n/g, "\n");
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, "<br />").trim())
    .filter(Boolean);

  return paragraphs.length
    ? paragraphs.map((p) => `<p>${p}</p>`).join("")
    : `<p>${normalized}</p>`;
};

const filterRelatedArticles = (articles: Article[], current: Article | null) => {
  if (!articles.length) return [];
  const currentKey = current ? (current as any).slug ?? (current as any).id : null;
  return articles
    .filter((a) => ((a as any).slug ?? (a as any).id) !== currentKey)
    .slice(0, 6);
};

export default function ArticleDetailPage() {
  const params = useParams<{ lang?: string; "article-slug"?: string }>();
  const router = useRouter();
  const lang = resolveLang(params?.lang);
  const dictionary = resolveDictionary(lang);

  const slugParam = params?.["article-slug"] ?? "";
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  const { data: article, isLoading, isError } = useArticleDetail(slug, lang);

  const relatedParams = useMemo(() => ({ page: 1, per_page: 6, lang }), [lang]);
  const relatedQuery = useArticles(relatedParams);
  const relatedArticles = useMemo(
    () => filterRelatedArticles((relatedQuery.data as any)?.data ?? [], (article as any) ?? null),
    [relatedQuery.data, article]
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

  const titleText =
    asString((article as any).title_text) ??
    asString((article as any).title) ??
    "";
  const contentText = asString((article as any).content_text) ?? "";
  const contentHtml = formatContent(contentText);

  const cover =
    asString((article as any).cover_url) ??
    asString((article as any).cover) ??
    FALLBACK_COVER;

  const rawDateTime =
    asString((article as any).published_at) ??
    asString((article as any).created_at);
  const publishedLabel = formatPublishedDate(rawDateTime, lang);

  const canonicalArticleUrl = getAbsoluteUrl(`/${lang}/article/${slug}`);
  const breadcrumbItems = [
    {
      name: dictionary.breadcrumb_home,
      url: getAbsoluteUrl(`/${lang}`),
    },
    {
      name: dictionary.breadcrumb_articles,
      url: getAbsoluteUrl(`/${lang}/article`),
    },
    {
      name: titleText || slug,
      url: canonicalArticleUrl,
    },
  ];
  const summary =
    asString((article as any).excerpt) ??
    (contentText ? contentText.slice(0, 200) : titleText);
  const updatedAt = asString((article as any).updated_at) ?? undefined;
  const authorName =
    asString((article as any).author_name) ?? "DMD Shoe Parts";

  return (
    <>
      <ArticleSchema
        title={titleText || slug}
        description={summary || titleText}
        slug={slug}
        coverImage={cover}
        publishedAt={rawDateTime ?? new Date().toISOString()}
        updatedAt={updatedAt}
        authorName={authorName}
        lang={lang}
        url={canonicalArticleUrl}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <main>
          <Container className="mx-auto w-full max-w-2xl px-4 py-8 sm:max-w-3xl md:max-w-4xl sm:py-10">
          {/* Breadcrumb */}
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
                <span aria-current="page" className="line-clamp-1">{titleText}</span>
              </li>
            </ol>
          </nav>

          {/* Article */}
          <article>
            <header className="mb-3">
              <h1 className="text-[28px] font-bold leading-tight text-[#003663] sm:text-[34px]">
                {titleText}
              </h1>

              <p className="mt-2 flex flex-wrap gap-2 text-sm text-[#003663]/90">
                {asString((article as any).author_name) ? (
                  <span className="font-medium">
                    {dictionary.by_author.replace(
                      "{{author}}",
                      (article as any).author_name as string
                    )}
                  </span>
                ) : null}
                {asString((article as any).author_name) && publishedLabel ? (
                  <span>·</span>
                ) : null}
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

            {/* Konten artikel dengan spacing & list style seragam */}
            <div className="article-content prose prose-neutral max-w-none text-gray-700 prose-h2:mt-6 prose-h2:text-xl prose-h2:font-bold prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1">
              {contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              ) : (
                <p>{dictionary.content_empty}</p>
              )}
            </div>

            {/* CSS override agar bullet & spacing sama seperti editor */}
            <style jsx global>{`
              .article-content ul,
              .article-content ol {
                list-style: revert;
                padding-left: 1.5rem;
                margin-top: 0.75rem;
                margin-bottom: 0.75rem;
              }
              .article-content ul { list-style-type: disc; }
              .article-content ol { list-style-type: decimal; }
              .article-content li { display: list-item; margin-top: 0.25rem; margin-bottom: 0.25rem; }
              .article-content li::marker { color: rgba(55, 65, 81, 1); } /* gray-700 */
              .article-content p { margin-top: 0.75rem; margin-bottom: 0.75rem; }
              .article-content h2,
              .article-content h3 {
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
            `}</style>
          </article>

          {/* Related section */}
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
    </>
  );
}
