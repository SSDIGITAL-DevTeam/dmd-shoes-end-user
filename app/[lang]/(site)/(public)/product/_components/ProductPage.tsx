"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import CategoriesList from "./CategoriesList";
import Container from "@/components/ui-custom/Container";
import FilterUkuran, { FilterValues } from "./FilterUkuran";
import ProductSortDesktop from "./ProductSortDesktop";
import ProductSortMobile from "./ProductSortMobile";
import ProductItem from "@/components/demo/product/ProductItem";
import { ApiBoundary } from "@/components/shared/ApiBoundary";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import { useProducts } from "@/hooks/useProducts";
import { CategoryService } from "@/services/category.service";
import { queryKeys } from "@/lib/query-keys";
import type { Category, Pagination, ProductCard } from "@/services/types";
import { inter, lato } from "@/config/font";
import ProductPagination from "./ProductPagination";

/* =========================
   Helpers
   ========================= */
function getChildrenIds(cats: Category[], parentId: number): number[] {
  return cats.filter((c) => c.parent_id === parentId).map((c) => c.id);
}
function hasChildren(cats: Category[], id: number): boolean {
  return cats.some((c) => c.parent_id === id);
}

type ProductPageProps = {
  lang: string;
  dictionaryProduct: any;
};

type ProductFiltersState = {
  search: string;
  categoryIds: number[];
  heel_min?: number;
  heel_max?: number;
  size_min?: number;
  size_max?: number;
  page: number;
  per_page: number;
  sort?: string;
  dir?: "asc" | "desc";
};

const DEFAULT_STATE: ProductFiltersState = {
  search: "",
  categoryIds: [],
  page: 1,
  per_page: 12,
  sort: "favorites_count",
  dir: "desc",
};

export default function ProductPage({ lang, dictionaryProduct }: ProductPageProps) {
  const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_STATE);
  const [openCategory, setOpenCategory] = useState(false);

  const updateFilters = useCallback(
    (updater: (prev: ProductFiltersState) => ProductFiltersState) => {
      setFilters((prev) => updater(prev));
    },
    []
  );

  // Ambil kategori
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.list({ lang }),
    queryFn: () => CategoryService.list({ lang, per_page: 50 }),
  });

  const categories: Category[] = categoriesQuery.data?.data ?? [];

  // Ambil produk (otomatis refetch setiap filters berubah)
  const productsParams = useMemo<Parameters<typeof useProducts>[0]>(
  () => ({
    lang,
    search: filters.search || undefined,
    category_ids: filters.categoryIds.length ? filters.categoryIds.join(",") : undefined,
    heel_min: filters.heel_min,
    heel_max: filters.heel_max,
    size_min: filters.size_min,
    size_max: filters.size_max,
    page: filters.page,
    per_page: filters.per_page,
    sort: filters.sort,
    dir: filters.dir,
    view: "card",
  }),
  [filters, lang]
);

const {
  products,
  filters: filterMeta,
  isLoading,
  isError,
  error,
  refetch,
} = useProducts(productsParams);


  /* ---------- Handlers ---------- */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    const isParent = hasChildren(categories, categoryId);
    const children = isParent ? getChildrenIds(categories, categoryId) : [];
    const parentId = categories.find((c) => c.id === categoryId)?.parent_id ?? null;

    updateFilters((prev) => {
      const ids = new Set(prev.categoryIds);
      const isSelected = ids.has(categoryId);
      const bundle = [categoryId, ...children];

      if (isSelected) {
        bundle.forEach((id) => ids.delete(id));

        if (!isParent && parentId) {
          const siblings = getChildrenIds(categories, parentId);
          const anySiblingSelected = siblings.some((id) => ids.has(id));
          if (!anySiblingSelected) ids.delete(parentId);
        }
      } else {
        bundle.forEach((id) => ids.add(id));

        if (!isParent && parentId) {
          const siblings = getChildrenIds(categories, parentId);
          const allSiblingsSelected = siblings.every((id) => ids.has(id));
          if (allSiblingsSelected) ids.add(parentId);
        }
      }

      return { ...prev, categoryIds: Array.from(ids), page: 1 };
    });
  };

  const handleFilterApply = (values: FilterValues) => {
    updateFilters((prev) => ({
      ...prev,
      heel_min: values.heel_min,
      heel_max: values.heel_max,
      size_min: values.size_min,
      size_max: values.size_max,
      page: 1,
    }));
  };

  const handleFilterReset = () => {
    updateFilters((prev) => ({
      ...prev,
      heel_min: undefined,
      heel_max: undefined,
      size_min: undefined,
      size_max: undefined,
      page: 1,
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortField, sortDir] = value.split(":");
    updateFilters((prev) => ({
      ...prev,
      sort: sortField || undefined,
      dir: (sortDir as "asc" | "desc" | undefined) ?? undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    updateFilters((prev) => ({ ...prev, page }));
  };

  /* ---------- Derived ---------- */
  const pagination = products satisfies Pagination<ProductCard>;
  const totalPages = pagination.last_page ?? 1;
  const totalItems = pagination.total ?? products.data.length ?? 0;

  const sortOptions = useMemo(
    () => [
      { label: dictionaryProduct?.sort?.newest ?? "Produk Terpopuler", value: "favorites_count:desc" },
      { label: dictionaryProduct?.sort?.priceLow ?? "Harga Terendah", value: "price:asc" },
      { label: dictionaryProduct?.sort?.priceHigh ?? "Harga Tertinggi", value: "price:desc" },
    ],
    [dictionaryProduct]
  );

  const selectedSortValue =
    filters.sort && filters.dir
      ? `${filters.sort}:${filters.dir}`
      : filters.sort
      ? `${filters.sort}:asc`
      : "favorites_count:desc";

  const sortDictionary = dictionaryProduct?.sort ?? {};
  const sizeFilterDictionary = dictionaryProduct?.sizeFilter;
  const baseAllProductsLabel =
    dictionaryProduct?.allProducts ?? (lang === "en" ? "All Products" : "Semua Produk");

  /* ---------- Render ---------- */
  return (
    <div className={`${inter.className} bg-[#F5F5F5]`}>
      <Container className="py-8">
        <header className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-primary font-semibold text-[32px] leading-[140%]">
              {dictionaryProduct?.title || "Our Products"}
            </h1>

            {/* Desktop controls */}
            <div className="hidden items-center gap-3 text-[#003663] lg:flex">
              <ProductSortDesktop
                label={sortDictionary.label ?? (lang === "en" ? "Sort :" : "Urutkan :")}
                value={selectedSortValue}
                options={sortOptions}
                onChange={handleSortChange}
              />

              <FilterUkuran
                heel={filterMeta?.heel_height_cm}
                size={filterMeta?.size_eu}
                values={{
                  heel_min: filters.heel_min,
                  heel_max: filters.heel_max,
                  size_min: filters.size_min,
                  size_max: filters.size_max,
                }}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
                fullWidth={false}
                dictionary={sizeFilterDictionary}
                locale={lang}
              />

              {/* Search */}
              <div className="relative">
                <FaSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#003663]"
                />
                <input
                  id="product-search"
                  type="search"
                  inputMode="search"
                  placeholder={dictionaryProduct?.searchPlaceholder || "Search products..."}
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="h-[40px] w-full rounded-lg border border-[#003663] bg-white px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
                />
              </div>
            </div>

            {/* Mobile sort */}
            <div className="lg:hidden">
              <ProductSortMobile
                value={selectedSortValue}
                options={sortOptions}
                onChange={handleSortChange}
                dictionary={sortDictionary}
              />
            </div>
          </div>
        </header>

        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden w-64 rounded-lg bg-white px-[32px] py-[24px] [--sidepad:32px] lg:block">
            <h3 className={`${lato.className} mb-3 text-lg font-semibold text-primary`}>
              {dictionaryProduct?.productCategory || "Kategori Produk"}
            </h3>
            <CategoriesList
              categories={categories}
              selectedIds={filters.categoryIds}
              onToggle={handleCategoryToggle}
              dictionary={{
                allProducts: baseAllProductsLabel,
                empty: dictionaryProduct?.categoriesEmpty,
              }}
              totalCount={totalItems}
              locale={lang}
            />
          </aside>

          {/* Produk grid */}
          <main className="flex-1">
            <ApiBoundary
              isLoading={isLoading}
              isError={isError}
              error={error}
              skeleton={
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              }
              empty={
                <div className="py-12 text-center text-sm text-gray-500">
                  {dictionaryProduct?.empty || "Produk tidak ditemukan."}
                </div>
              }
              isEmpty={(products?.data?.length ?? 0) === 0}
              onRetry={refetch}
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {products.data.map((product) => (
                  <ProductItem key={product.id} product={product} locale={lang} />
                ))}
              </div>
            </ApiBoundary>

            <ProductPagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              labels={{
                prev: dictionaryProduct?.prev ?? (lang.startsWith("en") ? "Previous" : "Sebelumnya"),
                next: dictionaryProduct?.next ?? (lang.startsWith("en") ? "Next" : "Selanjutnya"),
              }}
            />
          </main>
        </div>
      </Container>
    </div>
  );
}
