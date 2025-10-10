"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Container from "@/components/ui-custom/Container";
import ProductChoice from "./ProductChoice";
import ButtonWishlist from "./ButtonWishlist";
import ProductItem from "@/components/demo/product/ProductItem";
import type { ProductCard, ProductDetail } from "@/services/types";
import { CONTACT } from "@/config/contact";
import { inter } from "@/config/font";

type ProductSlugPageProps = {
  lang: string;
  dictionaryProduct: any;
  product: ProductDetail;
  related: ProductCard[];
};

const FALLBACK_IMAGE = "/assets/demo/demo-product.png";

const formatCurrency = (value: number, lang: string) => {
  const locale = lang.startsWith("en") ? "en-US" : "id-ID";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

type PreviewImage = {
  id: string;
  url: string;
  alt: string;
  title?: string | null;
};

// ===== Types to avoid `never[]` inference on attributes/options =====
type AttrOption = {
  id?: string | number;
  value?: string | { id?: string;[k: string]: string | undefined };
  value_text?: string;
};

type AttrData = {
  name_text?: string;
  name?: string | Record<string, string>;
  options?: AttrOption[];
};

// ===== Helpers =====
const ensurePreviewImages = (
  product: ProductDetail,
  fallbackName: string,
): PreviewImage[] => {
  const gallery = (product.gallery ?? [])
    .filter((item) => item?.url)
    .map((item, index) => ({
      id: String((item as any)?.id ?? index),
      url: (item as any)?.url ?? "",
      alt:
        (item as any)?.alt_text ??
        (item as any)?.alt ??
        (item as any)?.title ??
        fallbackName ??
        "Product image",
      title: (item as any)?.title ?? null,
    }));

  if (gallery.length > 0) return gallery;

  if (product.cover_url) {
    return [
      {
        id: String((product as any).id ?? "cover"),
        url: product.cover_url,
        alt: fallbackName ?? "Product image",
        title: fallbackName ?? null,
      },
    ];
  }

  return [
    {
      id: "fallback",
      url: FALLBACK_IMAGE,
      alt: fallbackName ?? "Product image",
      title: fallbackName ?? null,
    },
  ];
};

const attributeOptions = (
  product: ProductDetail,
  fallbackName: string,
): { label: string; options: string[] }[] =>
  ((product.attributes_data ?? []) as AttrData[]).map((attribute: AttrData) => {
    const label =
      attribute?.name_text ??
      (typeof attribute?.name === "string"
        ? attribute.name
        : (attribute?.name as Record<string, string> | undefined)?.id ??
        fallbackName) ??
      fallbackName;

    const options = (attribute?.options ?? ([] as AttrOption[])).map(
      (option: AttrOption) => {
        const lbl =
          option?.value_text ??
          (typeof option?.value === "string"
            ? option.value
            : option?.value?.id ?? String(option?.id ?? ""));
        return lbl ?? "";
      },
    );

    return { label, options };
  });

const variantDisplay = (
  product: ProductDetail,
  lang: string,
): { id: number; label: string; price: string | null; stock: number | null }[] =>
  (product.variants_data ?? []).map((variant: any) => ({
    id: typeof variant?.id === "number" ? variant.id : 0,
    label: variant?.label_text ?? variant?.label ?? "",
    price:
      typeof variant?.price === "number"
        ? formatCurrency(variant.price, lang)
        : null,
    stock: typeof variant?.stock === "number" ? variant.stock : null,
  }));

// ===== Component =====
export default function ProductSlugPage({
  lang,
  dictionaryProduct,
  product,
  related,
}: ProductSlugPageProps) {
  const detailDict = dictionaryProduct?.detail ?? {};
  const contactLabels = detailDict.contact ?? {};
  const wishlistLabels = detailDict.wishlist ?? {};
  const relatedProducts: ProductCard[] = Array.isArray(related) ? related : [];

  const fallbackName =
    (product as any).name_text ??
    (typeof product.name === "string"
      ? product.name
      : (product.name as Record<string, string> | undefined)?.[lang] ??
      (product.name as Record<string, string> | undefined)?.id ??
      product.slug ??
      "Product");

  const breadcrumbProducts =
    detailDict.breadcrumbProducts ??
    (lang.startsWith("en") ? "Products" : "Produk");
  const breadcrumbWishlist =
    detailDict.breadcrumbWishlist ??
    (lang.startsWith("en") ? "Wishlist" : "Wishlist");
  const categoryLabel =
    detailDict.category ?? (lang.startsWith("en") ? "Category" : "Kategori");
  const descriptionLabel =
    detailDict.description ??
    (lang.startsWith("en") ? "Description" : "Deskripsi");
  const priceLabel =
    detailDict.price ?? (lang.startsWith("en") ? "Price" : "Harga");
  const priceNote =
    detailDict.priceNote ??
    (lang.startsWith("en")
      ? "Price excludes shipping"
      : "Harga belum termasuk ongkir");
  const priceSuffix =
    detailDict.priceSuffix ??
    (lang.startsWith("en") ? "per pair" : "per pasang");
  const attributesTitle =
    detailDict.attributes ??
    (lang.startsWith("en") ? "Available Options" : "Pilihan yang tersedia");
  const variantsTitle =
    detailDict.variants ??
    (lang.startsWith("en") ? "Available Variants" : "Varian tersedia");
  const noVariantsLabel =
    detailDict.noVariants ??
    (lang.startsWith("en")
      ? "Variants not available"
      : "Varian belum tersedia");
  const relatedTitle =
    detailDict.related ??
    (lang.startsWith("en")
      ? "You may also like"
      : "Anda mungkin juga menyukainya");

  const safePreviews = useMemo<PreviewImage[]>(() => {
    const previews = ensurePreviewImages(product, fallbackName);
    if (previews.length > 0) return previews;
    return [
      {
        id: "fallback",
        url: FALLBACK_IMAGE,
        alt: fallbackName,
        title: fallbackName,
      },
    ];
  }, [product, fallbackName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activePreview = safePreviews[activeIndex] ?? safePreviews[0];

  const priceCandidates = [
    typeof (product as any).price === "number" ? (product as any).price : null,
    typeof (product as any).price_min === "number"
      ? (product as any).price_min
      : null,
    typeof (product as any).variants_min_price === "number"
      ? (product as any).variants_min_price
      : null,
  ].filter((value): value is number => value !== null);

  const displayPrice =
    priceCandidates.length > 0
      ? formatCurrency(priceCandidates[0], lang)
      : null;

  const attributes = useMemo(
    () => attributeOptions(product, fallbackName),
    [product, fallbackName],
  );
  const variants = useMemo(
    () => variantDisplay(product, lang),
    [product, lang],
  );

  return (
    <Container className={`${inter.className} py-10`}>
      <nav className="mb-6 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={`/${lang}/product`}
              className="text-primary hover:underline"
            >
              {breadcrumbProducts}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{fallbackName}</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <div className="relative h-[725px] w-[725px] max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
            <Image
              src={activePreview.url || FALLBACK_IMAGE}
              alt={activePreview.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 725px"
              className="object-cover"
              priority
            />
          </div>
          {safePreviews.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {safePreviews.map((preview, index) => (
                <button
                  key={preview.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-20 w-20 overflow-hidden rounded-md border transition ${activeIndex === index
                    ? "border-primary"
                    : "border-gray-200 hover:border-primary"
                    }`}
                  type="button"
                  aria-label={preview.title ?? preview.alt}
                >
                  <Image
                    src={preview.url || FALLBACK_IMAGE}
                    alt={preview.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-[#003663]">
              {fallbackName}
            </h1>
            <div className="space-y-1 text-sm text-gray-600">
              {(product as any).category_name ? (
                <p>
                  <span className="font-semibold text-gray-700">
                    {categoryLabel}:
                  </span>{" "}
                  {(product as any).category_name}
                </p>
              ) : null}
              {typeof (product as any).favorites_count === "number" ? (
                <p className="text-xs text-gray-500">
                  ❤️ {(product as any).favorites_count}{" "}
                  {lang.startsWith("en") ? "favorites" : "favorit"}
                </p>
              ) : null}
            </div>
          </header>

          {displayPrice ? (
            <div className="space-y-1">
              <div className="text-sm font-semibold uppercase text-primary">
                {priceLabel}
              </div>
              <div className="text-3xl font-bold text-[#121212]">
                {displayPrice}{" "}
                <span className="text-base font-medium text-gray-500">
                  {priceSuffix}
                </span>
              </div>
              {priceNote ? (
                <p className="text-sm text-[#D97706]">{priceNote}</p>
              ) : null}
            </div>
          ) : null}

          {(product as any).description_text ? (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-[#003663]">
                {descriptionLabel}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {(product as any).description_text}
              </p>
            </section>
          ) : null}

          {attributes.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[#003663]">
                {attributesTitle}
              </h2>
              {attributes
                .filter(({ options }) => options.length > 0)
                .map(({ label, options }) => (
                  <ProductChoice key={label} label={label} options={options} />
                ))}
            </section>
          ) : null}

          <div className="flex flex-col gap-3 lg:flex-row">
            <Link
              href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 lg:w-auto"
            >
              <FaWhatsapp size={22} aria-hidden />
              {/* <span>
                {contactLabels.whatsapp ??
                  (lang.startsWith("en")
                    ? "Contact via WhatsApp"
                    : "Hubungi via WhatsApp")}
              </span> */}
            </Link>
            <Link
              href={`mailto:${CONTACT.email}`}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-primary px-4 py-2 text-white transition hover:bg-[#04264b] lg:w-auto"
            >
              <CiMail size={22} aria-hidden />
              {/* <span>
                {contactLabels.email ??
                  (lang.startsWith("en") ? "Send Email" : "Kirim Email")}
              </span> */}
            </Link>
            <ButtonWishlist labels={wishlistLabels} />
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#003663]">
              {variantsTitle}
            </h2>
            {variants.length > 0 ? (
              <div className="space-y-2 rounded-lg border border-gray-200 p-4">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex flex-col gap-1 border-b border-dashed border-gray-200 pb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="font-medium text-[#121212]">
                      {variant.label}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      {variant.price ? <span>{variant.price}</span> : null}
                      {typeof variant.stock === "number" ? (
                        <span>
                          {lang.startsWith("en") ? "Stock" : "Stok"}:{" "}
                          {variant.stock}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{noVariantsLabel}</p>
            )}
          </section>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-16 space-y-6">
          <h2 className="text-xl font-semibold text-[#003663]">
            {relatedTitle}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((item: ProductCard) => (
              <ProductItem key={item.id} product={item} locale={lang} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
