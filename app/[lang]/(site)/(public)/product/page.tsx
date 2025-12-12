import { Suspense } from "react";
import type { PagePropsP, LangParamsP } from "@/types/next";
import ProductPageComponent from "./_components/ProductPage";
import { getDictionaryProduct } from "../../../../../dictionaries/product/get-dictionary-product";
import { generateMetadata as buildMetadata } from "@/app/utils/generateMetadata";
import { pageMetadata } from "@/constant/metadata";

export async function generateMetadata() {
  const meta = pageMetadata.product;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    path: "/product",
    locale: meta.openGraph.locale,
    openGraphOverride: meta.openGraph,
    twitterOverride: meta.twitter,
    cmsPath: "product",
  });
}

export default async function ProductPage({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;
  const dictionaryProduct = await getDictionaryProduct(lang);

  return (
    <Suspense fallback={null}>
      <ProductPageComponent lang={lang} dictionaryProduct={dictionaryProduct} />
    </Suspense>
  );
}
