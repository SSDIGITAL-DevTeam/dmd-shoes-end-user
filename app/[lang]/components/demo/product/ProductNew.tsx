"use client";

import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import type { ProductCard } from "@/services/types";
import Link from "next/link";
import React from "react";
import ProductGrid from "./ProductGrid";

type ProductNewProps = {
  locale?: string;
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  products?: ProductCard[];
  isLoading?: boolean;
};

const FALLBACK_NEW_PRODUCTS: ProductCard[] = [
  {
    id: 2011,
    slug: "latest-product-one",
    name: { id: "Produk Baru Satu", en: "New Product One" },
    name_text: "Produk Baru Satu",
    cover_url: "/assets/demo/demo-product.png",
    price: 215000,
  },
  {
    id: 2012,
    slug: "latest-product-two",
    name: { id: "Produk Baru Dua", en: "New Product Two" },
    name_text: "Produk Baru Dua",
    cover_url: "/assets/demo/demo-product.png",
    price: 229000,
  },
  {
    id: 2013,
    slug: "latest-product-three",
    name: { id: "Produk Baru Tiga", en: "New Product Three" },
    name_text: "Produk Baru Tiga",
    cover_url: "/assets/demo/demo-product.png",
    price: 241000,
  },
  {
    id: 2014,
    slug: "latest-product-four",
    name: { id: "Produk Baru Empat", en: "New Product Four" },
    name_text: "Produk Baru Empat",
    cover_url: "/assets/demo/demo-product.png",
    price: 255000,
  },
];

export default function ProductNew({
  locale = "id",
  title = "Koleksi Terbaru Kami",
  viewAllHref = "/",
  viewAllLabel = "Lihat semua",
  products,
  isLoading,
}: ProductNewProps) {
  const items =
    products && products.length > 0 ? products : FALLBACK_NEW_PRODUCTS;

  return (
    <div className="container mx-auto px-3">
      <h2 className="text-center text-[40px] font-semibold leading-[150%] text-[#003663]">
        {title}
      </h2>
      <div className="mt-10" />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <ProductGrid
          products={items}
          locale={locale}
          emptyState={
            <p className="py-12 text-center text-sm text-gray-500">
              Produk terbaru belum tersedia.
            </p>
          }
        />
      )}
      <Link
        href={viewAllHref}
        className="inline-block text-center font-[Assistant] text-[24px] font-normal leading-[150%] tracking-[0.6px] underline"
      >
        {viewAllLabel}
      </Link>
    </div>
  );
}
