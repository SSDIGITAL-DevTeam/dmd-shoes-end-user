"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
   Helpers (function declaration → hoisted)
   ========================= */
function getChildrenIds(cats: Category[], parentId: number): number[] {
  return cats.filter((c) => c.parent_id === parentId).map((c) => c.id);
}
function hasChildren(cats: Category[], id: number): boolean {
  return cats.some((c) => c.parent_id === id);
}

/**
 * Props diterima dari page (server component) yang mem-pass 'lang' & dictionary terjemahan.
 */
type ProductPageProps = {
  lang: string;
  dictionaryProduct: any;
};

/**
 * State filter yang diikat ke URLSearchParams agar shareable dan bisa di-refresh tanpa hilang.
 */
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

/** Helper: parse angka dari query string dengan aman */
const parseNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** Helper: parse daftar kategori (comma separated) dari query string */
const parseCategories = (value: string | null) =>
  value
    ? value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isFinite(v))
    : [];

/** Serialize state -> URLSearchParams (untuk sinkronisasi URL) */
const buildQueryFromState = (state: ProductFiltersState): URLSearchParams => {
  const params = new URLSearchParams();
  if (state.search) params.set("search", state.search);
  if (state.categoryIds.length) {
    params.set("category_ids", state.categoryIds.join(","));
  }
  if (state.heel_min !== undefined) params.set("heel_min", String(state.heel_min));
  if (state.heel_max !== undefined) params.set("heel_max", String(state.heel_max));
  if (state.size_min !== undefined) params.set("size_min", String(state.size_min));
  if (state.size_max !== undefined) params.set("size_max", String(state.size_max));
  if (state.page > 1) params.set("page", String(state.page));
  if (state.per_page !== DEFAULT_STATE.per_page) {
    params.set("per_page", String(state.per_page));
  }
  if (state.sort && state.sort !== DEFAULT_STATE.sort) {
    params.set("sort", state.sort);
  }
  if (state.dir && state.dir !== DEFAULT_STATE.dir) {
    params.set("dir", state.dir);
  }
  return params;
};

/** Deserialize URLSearchParams -> state (untuk initial load & navigasi back/forward) */
const buildStateFromSearchParams = (searchParams: URLSearchParams): ProductFiltersState => ({
  search: searchParams.get("search") ?? "",
  categoryIds: parseCategories(searchParams.get("category_ids")),
  heel_min: parseNumber(searchParams.get("heel_min")),
  heel_max: parseNumber(searchParams.get("heel_max")),
  size_min: parseNumber(searchParams.get("size_min")),
  size_max: parseNumber(searchParams.get("size_max")),
  page: parseNumber(searchParams.get("page")) ?? 1,
  per_page: parseNumber(searchParams.get("per_page")) ?? DEFAULT_STATE.per_page,
  sort: searchParams.get("sort") ?? DEFAULT_STATE.sort,
  dir: (searchParams.get("dir") as "asc" | "desc" | null) ?? DEFAULT_STATE.dir,
});

/** Adapter: map state -> input untuk hook useProducts (API list product) */
const buildQueryInput = (state: ProductFiltersState, lang: string): Parameters<typeof useProducts>[0] => ({
  lang,
  search: state.search || undefined,
  category_ids: state.categoryIds.length ? state.categoryIds.join(",") : undefined,
  heel_min: state.heel_min,
  heel_max: state.heel_max,
  size_min: state.size_min,
  size_max: state.size_max,
  page: state.page,
  per_page: state.per_page,
  sort: state.sort,
  dir: state.dir,
  view: "card",
});

export default function ProductPage({ lang, dictionaryProduct }: ProductPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [isPending, startTransition] = useTransition();

  /** State untuk membuka sidebar kategori pada mobile */
  const [openCategory, setOpenCategory] = useState(false);

  /** State filter tersinkron dengan URL */
  const [filters, setFilters] = useState<ProductFiltersState>(() =>
    buildStateFromSearchParams(new URLSearchParams(searchParams.toString())),
  );

  /** Sinkronkan state saat URL berubah (misal back/forward) */
  useEffect(() => {
    const paramsState = buildStateFromSearchParams(new URLSearchParams(searchParamsString));
    setFilters((prev) => ({ ...prev, ...paramsState }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  /** Update state + push ke URL tanpa scroll (UX halus) */
  const updateFilters = useCallback((updater: (prev: ProductFiltersState) => ProductFiltersState) => {
    setFilters((prev) => updater(prev));
  }, []);

  useEffect(() => {
    const params = buildQueryFromState(filters);
    const nextQuery = params.toString();
    if (nextQuery === searchParamsString) {
      return;
    }

    startTransition(() => {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    });
  }, [filters, pathname, router, searchParamsString, startTransition]);

  /** Params untuk query products */
  const productsParams = useMemo(() => buildQueryInput(filters, lang), [filters, lang]);

  /** Opsi sort diturunkan dari dictionary (fallback ID) */
  const sortOptions = useMemo(
    () => [
      { label: dictionaryProduct?.sort?.newest ?? "Produk Terpopuler", value: "favorites_count:desc" },
      { label: dictionaryProduct?.sort?.priceLow ?? "Harga Terendah", value: "price:asc" },
      { label: dictionaryProduct?.sort?.priceHigh ?? "Harga Tertinggi", value: "price:desc" },
    ],
    [dictionaryProduct],
  );

  /** Nilai tampilan select (format: field:dir) */
  const selectedSortValue =
    filters.sort && filters.dir ? `${filters.sort}:${filters.dir}` : filters.sort ? `${filters.sort}:asc` : "favorites_count:desc";

  /** Fetch daftar produk (termasuk meta filter utk FilterUkuran) */
  const { products, filters: filterMeta, isLoading, isError, error, refetch } = useProducts(productsParams);

  /** Fetch kategori untuk sidebar kiri */
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.list({ lang }),
    queryFn: () => CategoryService.list({ lang, per_page: 20 }),
  });

  // ====== Derived data ======
  const isMutating = isPending;
  const categories: Category[] = categoriesQuery.data?.data ?? [];

  // ====== Handlers ======

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    const isParent = hasChildren(categories, categoryId);
    const children = isParent ? getChildrenIds(categories, categoryId) : [];

    // Cari parent dari sebuah child (kalau yang diklik child)
    const parentId = categories.find((c) => c.id === categoryId)?.parent_id ?? null;

    updateFilters((prev) => {
      const ids = new Set(prev.categoryIds);
      const isSelected = ids.has(categoryId);
      const bundle = [categoryId, ...children];

      if (isSelected) {
        // Uncheck parent/child ⇒ lepas id itu + seluruh anak kalau parent
        bundle.forEach((id) => ids.delete(id));

        // Jika yang dilepas adalah child, dan parent ada dalam set, cek:
        // jika tidak ada child yang tersisa, lepas parent juga (opsional)
        if (!isParent && parentId) {
          const siblings = getChildrenIds(categories, parentId);
          const anySiblingSelected = siblings.some((id) => ids.has(id));
          if (!anySiblingSelected) ids.delete(parentId);
        }
      } else {
        // Check parent/child ⇒ tambah id + semua anak kalau parent
        bundle.forEach((id) => ids.add(id));

        // Jika yang dicentang child, dan semua sibling sekarang terpilih, auto-check parent
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

  const handlePageChange = (page: number) => {
    updateFilters((prev) => ({ ...prev, page }));
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

  // Pagination typing safety
  const pagination = products satisfies Pagination<ProductCard>;
  const totalPages = pagination.last_page ?? 1;
  const totalItems = pagination.total ?? products.data.length ?? 0;

  const sortDictionary = dictionaryProduct?.sort ?? {};
  const sizeFilterDictionary = dictionaryProduct?.sizeFilter;
  const baseAllProductsLabel =
    dictionaryProduct?.allProducts ?? (lang === "en" ? "All Products" : "Semua Produk");

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
                <label htmlFor="product-search" className="sr-only">
                  {dictionaryProduct?.searchPlaceholder || "Search products"}
                </label>
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
                  aria-describedby="search-help"
                />
                <span id="search-help" className="sr-only">
                  Type to filter products, results update automatically.
                </span>
              </div>
            </div>

            {/* Mobile sort trigger */}
            <div className="lg:hidden">
              <ProductSortMobile
                value={selectedSortValue}
                options={sortOptions}
                onChange={handleSortChange}
                dictionary={{
                  trigger: sortDictionary.trigger,
                  modalTitle: sortDictionary.modalTitle,
                  label: sortDictionary.label,
                  close: sortDictionary.close,
                }}
              />
            </div>
          </div>

          {/* Mobile search + filter buttons */}
          <div className="space-y-3 lg:hidden">
            <div className="relative">
              <label htmlFor="product-search-mobile" className="sr-only">
                {dictionaryProduct?.searchPlaceholder || "Search products"}
              </label>
              <FaSearch
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#003663]"
              />
              <input
                id="product-search-mobile"
                type="search"
                inputMode="search"
                placeholder={dictionaryProduct?.searchPlaceholder || "Search products..."}
                value={filters.search}
                onChange={handleSearchChange}
                className="h-[40px] w-full rounded-lg border border-[#003663] bg-white px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOpenCategory(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#003663] bg-white px-3 py-2 text-sm text-[#003663] shadow-sm transition hover:border-[#002a4f] hover:text-[#002a4f]"
                aria-haspopup="dialog"
                aria-expanded={openCategory}
                aria-controls="mobile-category-panel"
              >
                <Image src="/assets/svg/icon/icon-category-filter.svg" alt="" width={16} height={16} />
                <span className="font-medium">
                  {dictionaryProduct?.filterCategory || "Filter Category"}
                </span>
              </button>

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
                dictionary={sizeFilterDictionary}
                locale={lang}
              />
            </div>
          </div>
        </header>

        {/* Layout 2 kolom */}
        <div className="flex gap-6">
          {/* Overlay mobile */}
          {openCategory ? (
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpenCategory(false)} />
          ) : null}

          {/* Sidebar kategori – mobile */}
          <aside
            className={`fixed top-0 right-0 z-50 h-full w-[320px] transform bg-white
              px-[32px] py-[24px] [--sidepad:32px]
              shadow-lg transition-transform duration-300 lg:hidden
              ${openCategory ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`${lato.className} text-lg font-semibold text-[#003663]`}>
                {dictionaryProduct?.productCategory || "Kategori Produk"}
              </h2>
              <button onClick={() => setOpenCategory(false)} className="text-xl">
                &times;
              </button>
            </div>
            <CategoriesList
              categories={categories}
              dictionary={{
                allProducts: baseAllProductsLabel,
                empty: dictionaryProduct?.categoriesEmpty,
              }}
              selectedIds={filters.categoryIds}
              onToggle={handleCategoryToggle}
              totalCount={totalItems}
              locale={lang}
            />
          </aside>

          {/* Sidebar kategori – desktop */}
          <aside className="hidden w-64 rounded-lg bg-white px-[32px] py-[24px] [--sidepad:32px] lg:block">
            <div>
              <h3 className={`${lato.className} mb-3 text-lg font-semibold text-primary lg:text-black`}>
                {dictionaryProduct?.productCategory || "Kategori Produk"}
              </h3>
            </div>
            <CategoriesList
              categories={categories}
              dictionary={{
                allProducts: baseAllProductsLabel,
                empty: dictionaryProduct?.categoriesEmpty,
              }}
              selectedIds={filters.categoryIds}
              onToggle={handleCategoryToggle}
              totalCount={totalItems}
              locale={lang}
            />
          </aside>

          {/* Grid produk + pagination */}
          <main className="flex-1">
            <ApiBoundary
              isLoading={isLoading || isMutating}
              isError={isError}
              error={error}
              skeleton={
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              }
              empty={<div className="py-12 text-center text-sm text-gray-500">
                {dictionaryProduct?.empty || "Produk tidak ditemukan."}
              </div>}
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

