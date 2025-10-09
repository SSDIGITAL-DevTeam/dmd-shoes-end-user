
import ProductPageComponent from "./_components/ProductPage";
import type { Locale } from "../../../../../i18n-config";
import { getDictionaryProduct } from "../../../../../dictionaries/product/get-dictionary-product";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionaryProduct = await getDictionaryProduct(lang);
  return (
    <ProductPageComponent
      lang={lang}
      dictionaryProduct={dictionaryProduct}
    />
  );
}
