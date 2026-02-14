import { Suspense } from "react";
import type { PagePropsP, LangParamsP } from "@/types/next";
import ArticlePageClient from "./ArticlePageClient";
import { generateMetadata as buildMetadata } from "@/app/utils/generateMetadata";
import { pageMetadata } from "@/constant/metadata";

export async function generateMetadata() {
  const meta = pageMetadata.article;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    path: "/article",
    locale: meta.openGraph.locale,
    openGraphOverride: meta.openGraph,
    twitterOverride: meta.twitter,
    cmsPath: "article",
  });
}

export default async function ArticlePage({
  params,
}: PagePropsP<LangParamsP>) {
  const { lang } = await params;

  return (
    <Suspense fallback={null}>
      <ArticlePageClient lang={lang} />
    </Suspense>
  );
}
