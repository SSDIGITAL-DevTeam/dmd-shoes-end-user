import type { PagePropsP, LangParamsP } from "@/types/next";
import ProductPageComponent from "./_components/ProductPage";
import { getDictionaryProduct } from "../../../../../dictionaries/product/get-dictionary-product";

export default async function ProductPage({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;
  const dictionaryProduct = await getDictionaryProduct(lang);

  return <ProductPageComponent lang={lang} dictionaryProduct={dictionaryProduct} />;
}
