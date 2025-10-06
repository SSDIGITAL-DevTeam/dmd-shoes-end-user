import React from "react";
import Image from "next/image";
import Link from "next/link";

export type Article = {
  date: string;
  title: string;
  slug: string;
  image: string;
};

interface ArticleItemProps {
  article: Article;
}

function ArticleItem({ article }: ArticleItemProps) {
  return (
    <Link  href={`/article/${article.slug}`}
      className="relative bg-white shadow-sm overflow-visible">
      {/* Cover */}
      <div className="relative h-60 w-full">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content absolute */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-white p-4 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{article.date}</p>
        <h2 className="text-base font-semibold text-gray-800 mb-2">
          {article.title}
        </h2>

        <button
          
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-blue-800 transition-colors"
        >
          Baca Selengkapnya
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </Link>
  );
}

export default ArticleItem;
