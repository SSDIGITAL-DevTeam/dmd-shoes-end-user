import { Suspense } from "react";
import type { PagePropsP, LangParamsP } from "@/types/next";
import ArticlePageClient from "./ArticlePageClient";

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
