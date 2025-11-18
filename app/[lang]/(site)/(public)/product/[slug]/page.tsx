import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductSlugPage from "./_component/ProductSlugPage";
import ProductSchema from "@/app/seo/schema/ProductSchema";
import BreadcrumbSchema from "@/app/seo/schema/BreadcumbSchema";
import type { Locale } from "../../../../../../i18n-config";
import { getDictionaryProduct } from "../../../../../../dictionaries/product/get-dictionary-product";
import { ProductDetailService } from "@/services/product-detail.service";
import { ProductService } from "@/services/product.service";
import type { ProductCard, ProductDetail, ProductVariant } from "@/services/types";
import { getAbsoluteUrl } from "@/lib/site";

type PageParams = Promise<{ lang: Locale; slug: string }>;

const FALLBACK_IMAGE = "/assets/demo/demo-product.png";

const resolveProductPrice = (product: ProductDetail) => {
  if (typeof product.price === "number" && product.price > 0) return product.price;
  if (
    typeof product.variants_min_price === "number" &&
    product.variants_min_price > 0
  ) {
    return product.variants_min_price;
  }
  const variantPrices =
    product.variants_data?.flatMap((variant: ProductVariant) => {
      const prices = [];
      if (typeof variant.price === "number" && variant.price > 0) {
        prices.push(variant.price);
      }
      if (typeof variant.price_min === "number" && variant.price_min > 0) {
        prices.push(variant.price_min);
      }
      return prices;
    }) ?? [];
  return variantPrices.length ? Math.min(...variantPrices) : 0;
};

const resolveAvailability = (product: ProductDetail) => {
  if (!Array.isArray(product.variants_data) || product.variants_data.length === 0) {
    return "InStock" as const;
  }
  const hasStock = product.variants_data.some((variant) => {
    if (typeof variant.stock === "number") {
      return variant.stock > 0;
    }
    return true;
  });
  return hasStock ? ("InStock" as const) : ("OutOfStock" as const);
};

const resolveImages = (product: ProductDetail) => {
  const gallery =
    product.gallery?.map((item) => item.url || item.title || "").filter(Boolean) ??
    [];
  const cover = product.cover_url || product.cover || "";
  const all = [...gallery, cover, FALLBACK_IMAGE].filter(Boolean);
  const unique = Array.from(new Set(all));
  return unique.length ? unique : [FALLBACK_IMAGE];
};

const resolveDescription = (product: ProductDetail) => {
  if (product.description_text) return product.description_text;
  if (typeof product.description === "string") return product.description;
  if (
    product.description &&
    typeof product.description === "object" &&
    Object.keys(product.description).length
  ) {
    const first = Object.values(product.description).find(
      (value) => typeof value === "string" && value.trim(),
    );
    if (first) {
      return String(first);
    }
  }
  return "";
};

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

  const manualRelated = Array.isArray(product.related_products)
    ? product.related_products
        .filter(
          (item): item is ProductCard =>
            !!item && typeof item === "object" && item.slug !== product.slug,
        )
        .slice(0, 4)
    : [];

  let related: ProductCard[] = manualRelated;

  if (related.length === 0) {
    try {
      const relatedResponse = await ProductService.list({
        lang,
        per_page: 8,
        sort: "favorites_count",
        dir: "desc",
        view: "card",
      });
      related = relatedResponse.data
        .filter(
          (item) =>
            item.slug !== product.slug &&
            !manualRelated.some((manual) => manual.id === item.id),
        )
        .slice(0, 4);
    } catch (error) {
      console.error("Failed to fetch related products", error);
    }
  }

  const productUrl = getAbsoluteUrl(`/${lang}/product/${product.slug}`);
  const breadcrumbItems = [
    {
      name: lang === "en" ? "Home" : "Beranda",
      url: getAbsoluteUrl(`/${lang}`),
    },
    {
      name: lang === "en" ? "Products" : "Produk",
      url: getAbsoluteUrl(`/${lang}/product`),
    },
    {
      name: product.name_text ?? product.name?.[lang] ?? product.slug,
      url: productUrl,
    },
  ];

  return (
    <>
      <ProductSchema
        name={product.name_text ?? product.slug}
        description={resolveDescription(product)}
        images={resolveImages(product)}
        sku={product.slug ?? product.id?.toString()}
        price={resolveProductPrice(product)}
        currency="IDR"
        availability={resolveAvailability(product)}
        url={productUrl}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Suspense fallback={null}>
        <ProductSlugPage
          lang={lang}
          dictionaryProduct={dictionary}
          product={product}
          related={related}
        />
      </Suspense>
    </>
  );
}
