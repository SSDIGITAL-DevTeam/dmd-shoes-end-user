import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/services/types";
import { inter } from "@/config/font";

type CategorySectionProps = {
  lang: string;
  categories?: Category[];
  isLoading?: boolean;
  className?: string;
};

const containerClass = "mx-auto w-full max-w-[1200px] px-4 md:px-6";

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

const resolveName = (category: Category, lang: string) => {
  if (category.name_text) return category.name_text;
  if (category.name && typeof category.name === "object") {
    return (
      category.name[lang] ??
      category.name.id ??
      category.name.en ??
      Object.values(category.name).find(Boolean) ??
      ""
    );
  }
  if (typeof category.name === "string") return category.name;
  return "";
};

export default function CategorySection({ lang, categories, isLoading, className }: CategorySectionProps) {
  const items = categories?.length ? categories.slice(0, 4) : FALLBACK_CATEGORIES;

  return (
    <section className={clsx(inter.className, className)}>
      <div className={containerClass}>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-48 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 sm:h-64 lg:h-72"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {items.map((cat) => {
              const name = resolveName(cat, lang);
              const label = name || cat.slug;
              return (
                <Link
                  href={`/${lang}/product?category_ids=${cat.id}`}
                  key={`${cat.id}-${cat.slug}`}
                  className="flex flex-col transition hover:-translate-y-1 hover:text-primary"
                >
                  <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "750 / 580" }}>
                    <Image
                      src={cat.cover_url ?? "/assets/demo/product-category-demo.webp"}
                      alt={label || "Category"}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 50vw, 50vw"
                      priority={false}
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2 w-full">
                    <span className="text-base font-semibold uppercase md:text-[15px]">
                      {label} &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
