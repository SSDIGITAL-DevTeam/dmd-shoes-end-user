"use client";

import Container from "@/components/ui-custom/Container";
import type { Category } from "@/services/types";
import Image from "next/image";
import Link from "next/link";
import { Assistant, Inter } from "next/font/google";
import React from "react";
import clsx from "clsx";
import { BannerSkeleton } from "@/components/shared/Skeletons";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const assistant = Assistant({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type CategorySectionProps = {
  lang: string;
  dict: any;
  categories?: Category[];
  isLoading?: boolean;
  className?: string; // NEW: control spacing from parent
};

const FALLBACK_CATEGORIES: Category[] = [
  { id: 301, slug: "shoe-heels", name: { id: "Shoe Heels", en: "Shoe Heels" }, name_text: "Shoe Heels", cover_url: "/assets/demo/product-category-demo.webp" } as Category,
  { id: 302, slug: "clear-heels", name: { id: "Clear Heels", en: "Clear Heels" }, name_text: "Clear Heels", cover_url: "/assets/demo/product-category-demo.webp" } as Category,
  { id: 303, slug: "outsole", name: { id: "Outsole", en: "Outsole" }, name_text: "Outsole", cover_url: "/assets/demo/product-category-demo.webp" } as Category,
  { id: 304, slug: "wedges", name: { id: "Wedges", en: "Wedges" }, name_text: "Wedges", cover_url: "/assets/demo/product-category-demo.webp" } as Category,
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
  className,
}: CategorySectionProps) {
  const items = categories?.length ? categories.slice(0, 4) : FALLBACK_CATEGORIES;

  return (
    <section className={clsx(inter.className, className)}>
      <Container>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <BannerSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {items.map((cat) => {
              const name = resolveName(cat, lang);
              return (
                <Link
                  href={`/${lang}/product?category_ids=${cat.id}`}
                  key={`${cat.id}-${cat.slug}`}
                  className="flex flex-col"
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "750 / 580" }}
                  >
                    <Image
                      src={cat.cover_url ?? "/assets/demo/product-category-demo.webp"}
                      alt={name || "Category"}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 50vw, 50vw"
                    />
                  </div>

                  {/* perkecil jarak judul dari gambar */}
                  <div className="mt-2 w-full">
                    <span className="text-base font-semibold uppercase transition hover:text-primary md:text-[15px]">
                      {name || cat.slug} &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
