import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/services/types";

const FALLBACK_COVER = "/assets/demo/article/article-item.webp";

const formatPublishedDate = (value?: string | null, locale = "id") => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

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

type ArticleItemProps = {
  article: Article;
  lang: string;
  readMoreLabel: string;
};

function ArticleItem({ article, lang, readMoreLabel }: ArticleItemProps) {
  const href = `/${lang}/article/${article.slug ?? article.slug_id ?? article.id}`;
  const cover = article.cover_url ?? article.cover ?? FALLBACK_COVER;
  const publishedLabel = formatPublishedDate(article.published_at ?? article.created_at, lang);

  return (
    <Link href={href} className="relative bg-white shadow-sm overflow-visible" prefetch={false}>
      <div className="relative h-60 w-full">
        <Image
          src={cover}
          alt={article.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-white p-4 shadow-lg">
        {publishedLabel ? <p className="text-xs text-gray-500 mb-1">{publishedLabel}</p> : null}
        <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h2>

        <span className="inline-flex items-center text-sm font-semibold text-primary hover:text-blue-800 transition-colors">
          {readMoreLabel}
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default ArticleItem;
