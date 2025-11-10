"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Inter, Assistant } from "next/font/google";
import { FaHeart } from "react-icons/fa";
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
    lowestPrice = productPriceMin ?? variantLowestPrice ?? productPrice ?? null;
  } else {
    lowestPrice = productPrice ?? productPriceMin ?? variantLowestPrice ?? null;
  }

  const priceLabel = formatCurrency(lowestPrice) ?? "-";
  const href = `/${locale}/product/${product.slug ?? product.id}`;
  const favoritesCount =
    typeof product.favorites_count === "number" ? product.favorites_count : null;

  return (
    <div
      className={`${assistant.className} group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-lg`}
    >
      <Link href={href} className="flex h-full flex-col">
        {/* FOTO */}
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
            className="object-cover"
          />
        </div>

        {/* TEKS */}
        <div className="flex flex-1 flex-col justify-between p-2 md:p-3">
          {/* Bagian atas: judul */}
          <div>
            <div
              className={`${inter.className} text-sm font-semibold leading-[130%] text-[#121212] md:text-[15px]`}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {displayName}
            </div>
          </div>

          {/* Bagian bawah: kategori, harga, fav */}
          <div className="mt-2 flex flex-col justify-end">
            {product.category_name ? (
              <div className="text-xs text-[#121212]/70 md:text-sm">
                {product.category_name}
              </div>
            ) : (
              <div className="h-[18px] md:h-[20px]" aria-hidden />
            )}

            <div className="mt-1 flex flex-wrap items-center gap-2 text-[#121212]">
              <span className="text-sm font-semibold">{priceLabel}</span>
              <span className="text-xs text-[#121212]/70 md:text-sm">
                / {locale === "en" ? "pair" : "pasang"}
              </span>
            </div>

            {favoritesCount !== null ? (
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#F97316] md:text-sm">
                <FaHeart className="h-3 w-3 md:h-3.5 md:w-3.5" aria-hidden="true" />
                <span>{favoritesCount}</span>
              </div>
            ) : (
              <div className="mt-2 h-[16px]" aria-hidden />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
