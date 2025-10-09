"use client";

import Container from "@/components/ui-custom/Container";
import type { Category } from "@/services/types";
import Image from "next/image";
import Link from "next/link";
import { Assistant, Inter } from "next/font/google";
import React from "react";
import { BannerSkeleton } from "@/components/shared/Skeletons";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type CategorySectionProps = {
  lang: string;
  dict: any;
  categories?: Category[];
  isLoading?: boolean;
};

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 301,
    slug: "shoe-heels",
    name: { id: "Shoe Heels", en: "Shoe Heels" },
    name_text: "Shoe Heels",
    cover_url: "/assets/demo/product-category-demo.webp",
  } as Category,
  {
    id: 302,
    slug: "clear-heels",
    name: { id: "Clear Heels", en: "Clear Heels" },
    name_text: "Clear Heels",
    cover_url: "/assets/demo/product-category-demo.webp",
  } as Category,
  {
    id: 303,
    slug: "outsole",
    name: { id: "Outsole", en: "Outsole" },
    name_text: "Outsole",
    cover_url: "/assets/demo/product-category-demo.webp",
  } as Category,
  {
    id: 304,
    slug: "wedges",
    name: { id: "Wedges", en: "Wedges" },
    name_text: "Wedges",
    cover_url: "/assets/demo/product-category-demo.webp",
  } as Category,
];

const resolveName = (category: Category, lang: string) =>
  category.name_text ??
  (category.name && typeof category.name === "object"
    ? category.name[lang] ?? category.name.id ?? category.name.en ?? ""
    : "");

export default function CategorySection({
  lang,
  dict,
  categories,
  isLoading,
}: CategorySectionProps) {
  const items =
    categories && categories.length > 0
      ? categories.slice(0, 4)
      : FALLBACK_CATEGORIES;

  return (
    <div className={`py-[60px] ${inter.className}`}>
      <Container>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <BannerSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {items.map((cat) => {
              const name = resolveName(cat, lang);
              return (
                <Link
                  href={`/${lang}/product?category=${cat.id}`}
                  key={`${cat.id}-${cat.slug}`}
                  className="flex flex-col"
                >
                  <div className="w-full">
                    <Image
                      src={cat.cover_url ?? "/assets/demo/product-category-demo.webp"}
                      alt={name || "Category"}
                      width={800}
                      height={600}
                      className="h-auto w-full object-cover"
                    />
                  </div>

                  <div className="mt-8 w-full">
                    <h2 className="mt-4 text-[18px] font-semibold uppercase tracking-wide">
                      {name || cat.slug}
                    </h2>

                    <div>
                      <button
                        className={`mt-2 inline-block rounded-[40px] bg-primary px-4 py-2 text-[14px] text-white transition hover:bg-primary/90 ${assistant.className}`}
                      >
                        {dict?.category?.more ?? "Lihat Produk"} &gt;
                      </button>
                    </div>

                    <div>
                      <button className="mt-4 text-sm text-gray-600 transition hover:text-primary">
                        {name || cat.slug} &rarr;
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
