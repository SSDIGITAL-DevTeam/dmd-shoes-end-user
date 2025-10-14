"use client";

import React from "react";
import ProductItem from "./ProductItem";
import type { ProductCard } from "@/services/types";

type ProductGridProps = {
  products?: ProductCard[];
  locale?: string;
  emptyState?: React.ReactNode;
};

const buildKey = (
  product: ProductCard,
  index: number,
  locale: string,
): string => {
  const nameFallback =
    product.name_text ??
    (product.name && typeof product.name === "object"
      ? product.name[locale] ?? product.name.id ?? product.name.en ?? "product"
      : "product");
  return `${product.id ?? nameFallback}-${product.slug ?? nameFallback}-${index}`;
};

export default function ProductGrid({
  products,
  locale = "id",
  emptyState,
}: ProductGridProps) {
  const items = products ?? [];

  if (items.length === 0) {
    return emptyState ?? (
      <p className="py-12 text-center text-sm text-gray-500">Produk belum tersedia.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
      {items.map((product, index) => (
        <ProductItem key={buildKey(product, index, locale)} product={product} locale={locale} />
      ))}
    </div>
  );
}
