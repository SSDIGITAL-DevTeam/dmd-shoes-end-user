import { notFound } from "next/navigation";
import ProductSlugPage from "./_component/ProductSlugPage";
import type { Locale } from "../../../../../../i18n-config";
import { getDictionaryProduct } from "../../../../../../dictionaries/product/get-dictionary-product";
import { ProductDetailService } from "@/services/product-detail.service";
import { ProductService } from "@/services/product.service";
import type { ProductCard } from "@/services/types";

type PageParams = Promise<{ lang: Locale; slug: string }>;

export default async function ProductDetailRoute({
  params,
}: {
  params: PageParams;
}) {
  const { lang, slug } = await params;
  const dictionary = await getDictionaryProduct(lang);

  const product = await ProductDetailService.findBySlug(slug, lang).catch(
    (error) => {
      console.error("Failed to fetch product detail", error);
      return null;
    },
  );

  if (!product) {
    notFound();
  }

  let related: ProductCard[] = [];
  try {
    const relatedResponse = await ProductService.list({
      lang,
      per_page: 8,
      sort: "favorites_count",
      dir: "desc",
      view: "card",
    });
    related = relatedResponse.data
      .filter((item) => item.slug !== product.slug)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products", error);
  }

  return (
    <ProductSlugPage
      lang={lang}
      dictionaryProduct={dictionary}
      product={product}
      related={related}
    />
  );
}
