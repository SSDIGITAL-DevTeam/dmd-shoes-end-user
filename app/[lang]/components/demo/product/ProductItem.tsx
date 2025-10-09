"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Inter, Assistant } from "next/font/google";
import type { ProductCard } from "@/services/types";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

type ProductItemProps = {
  product: ProductCard;
  locale?: string;
  assetFallback?: string;
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const parsePrice = (value?: number | string | null): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export default function ProductItem({
  product,
  locale = "id",
  assetFallback = "/assets/demo/demo-product.png",
}: ProductItemProps) {
  const displayName = useMemo(() => {
    if (product.name_text) return product.name_text;
    if (product.name && typeof product.name === "object") {
      return (
        product.name[locale] ??
        product.name.id ??
        product.name.en ??
        Object.values(product.name).find(Boolean) ??
        "Produk"
      );
    }
    if (typeof product.name === "string") return product.name;
    return "Produk";
  }, [locale, product.name, product.name_text]);

  const imageUrl = product.cover_url ?? (product as any).cover_url ?? assetFallback;

  const pricingModeRaw = (product as any).pricing_mode;
  const pricingMode =
    typeof pricingModeRaw === "string"
      ? (pricingModeRaw as string).toLowerCase()
      : "single";

  const productPrice = parsePrice((product as any).price);
  const productPriceMin = parsePrice((product as any).price_min);

  const variantPrices: number[] = Array.isArray(
    (product as { variants_data?: { price?: number | string | null }[] }).variants_data,
  )
    ? ((product as { variants_data?: { price?: number | string | null }[] }).variants_data || [])
        .map((variant) => parsePrice(variant.price))
        .filter((value): value is number => value !== null)
    : [];

  const variantLowestPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : null;

  let lowestPrice: number | null = null;

  if (pricingMode === "per_variant") {
    // per-variant -> utamakan price_min dari API, fallback ke harga varian atau price produk jika tersedia
    lowestPrice =
      productPriceMin ??
      variantLowestPrice ??
      productPrice ??
      null;
  } else {
    // single (default) -> pakai harga produk, fallback ke price_min atau harga varian
    lowestPrice =
      productPrice ??
      productPriceMin ??
      variantLowestPrice ??
      null;
  }

  const priceLabel = formatCurrency(lowestPrice) ?? "-";
  const href = `/${locale}/product/${product.slug ?? product.id}`;

  return (
    <div className={`${assistant.className} bg-white flex flex-col rounded-lg shadow-sm transition hover:shadow-lg`}>
      <Link href={href} className="block relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1024px) 25vw, 20vw"
            className="object-cover"
          />
        </div>

        <div className="p-[16px] space-y-2">
          <div className={`${inter.className} mt-2 text-[18px] font-semibold leading-[130%] text-[#121212]`}>
            {displayName}
          </div>

          {product.category_name ? (
            <div className="text-[14px] text-[#121212]/70 leading-[130%]">
              {product.category_name}
            </div>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[#121212]">
            <span className="text-[14px] leading-[130%]">
              <b className="text-[16px]">{priceLabel}</b>
            </span>
            <span className="text-[14px] leading-[130%] text-[#121212]/70">
              / {locale === "en" ? "pair" : "pasang"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
