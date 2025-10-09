"use client";

import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import Container from "@/components/ui-custom/Container";
import type { ProductCard } from "@/services/types";
import Link from "next/link";
import { Assistant } from "next/font/google";
import React from "react";
import ProductGrid from "./ProductGrid";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

const FEATURED_FALLBACK_LABELS: Record<
  string,
  { title: string; viewAll: string }
> = {
  id: {
    title: "Produk Unggulan",
    viewAll: "Lihat semua produk",
  },
  en: {
    title: "Featured Products",
    viewAll: "View all products",
  },
};

type ProductPromoProps = {
  lang: string;
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  products?: ProductCard[];
  isLoading?: boolean;
};

const FALLBACK_PRODUCTS: ProductCard[] = [
  {
    id: 1001,
    slug: "product-one",
    name: { id: "Product One", en: "Product One" },
    name_text: "Product One",
    cover_url: "/assets/demo/demo-product.png",
    price: 200000,
  },
  {
    id: 1002,
    slug: "product-two",
    name: { id: "Product Two", en: "Product Two" },
    name_text: "Product Two",
    cover_url: "/assets/demo/demo-product.png",
    price: 230000,
  },
  {
    id: 1003,
    slug: "product-three",
    name: { id: "Product Three", en: "Product Three" },
    name_text: "Product Three",
    cover_url: "/assets/demo/demo-product.png",
    price: 250000,
  },
  {
    id: 1004,
    slug: "product-four",
    name: { id: "Product Four", en: "Product Four" },
    name_text: "Product Four",
    cover_url: "/assets/demo/demo-product.png",
    price: 260000,
  },
];

export default function ProductPromo({
  lang,
  title,
  viewAllLabel,
  viewAllHref = `/${lang}/product`,
  products,
  isLoading,
}: ProductPromoProps) {
  const items = products && products.length > 0 ? products : FALLBACK_PRODUCTS;
  const fallbackLabels =
    FEATURED_FALLBACK_LABELS[lang] ?? FEATURED_FALLBACK_LABELS.id;
  const resolvedTitle = title ?? fallbackLabels.title;
  const resolvedViewAllLabel = viewAllLabel ?? fallbackLabels.viewAll;

  return (
    <Container className="space-y-[28px]">
      <h2 className="text-center text-[32px] font-bold leading-[130%] text-primary">
        {resolvedTitle}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <ProductGrid
          products={items}
          locale={lang}
          emptyState={
            <p className="py-12 text-center text-sm text-gray-500">
              Produk belum tersedia.
            </p>
          }
        />
      )}

      <div className="flex">
        <Link
          href={viewAllHref}
          className={`${assistant.className} inline-block w-full text-center text-[24px] font-normal leading-[150%] tracking-[0.6px] underline`}
        >
          {resolvedViewAllLabel}
        </Link>
      </div>
    </Container>
  );
}
