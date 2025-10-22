"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Category } from "@/services/types";
import { lato } from "@/config/font";

type CategoriesListProps = {
  categories?: Category[];
  selectedIds: number[];
  onToggle: (categoryId: number) => void;
  dictionary?: {
    allProducts?: string;
    empty?: string;
    toggleLabel?: string;
  };
  /** Tidak dipakai lagi untuk label "Semua Produk" */
  totalCount?: number;
  locale?: string;
};

type GroupedCategory = {
  parent: Category;
  children: Category[];
};

const toCountValue = (value?: number | null): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const aggregateParentCount = (parent: Category, children: Category[]): number => {
  const parentCount = toCountValue(parent.products_count);
  const childTotal = children.reduce((sum, child) => sum + toCountValue(child.products_count), 0);
  // Hindari double-count: bila parent sudah >= total anak, pakai parent; jika tidak, pakai parent+anak
  if (parentCount > 0 && parentCount >= childTotal) return parentCount;
  return parentCount + childTotal;
};

/** ===== Hanya tampilkan kategori yang benar-benar punya produk ===== */
const buildGroups = (categories: Category[]): GroupedCategory[] => {
  const hasOwnProducts = (c: Category) => toCountValue(c.products_count) > 0;

  const parents = categories.filter((cat) => !cat.parent_id);
  const childrenOf = (pid: number) =>
    categories.filter((cat) => cat.parent_id === pid && hasOwnProducts(cat));

  const grouped: GroupedCategory[] = [];

  for (const parent of parents) {
    const children = childrenOf(parent.id);
    const total = aggregateParentCount(parent, children);
    if (total > 0) grouped.push({ parent, children });
  }

  // Orphan (child yang parent-nya tidak ada di data)
  const parentIds = new Set(parents.map((p) => p.id));
  const orphans = categories.filter(
    (cat) => cat.parent_id && !parentIds.has(cat.parent_id) && hasOwnProducts(cat)
  );

  return [...grouped, ...orphans.map((cat) => ({ parent: cat, children: [] as Category[] }))];
};

/* ---------- Row ---------- */
function CategoryRow({
  parent,
  children,
  selectedIds,
  onToggle,
  toggleLabel,
}: {
  parent: Category;
  children: Category[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  toggleLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children.length > 0;

  const selectedChildrenCount = children.filter((c) => selectedIds.includes(c.id)).length;
  const allChildrenSelected = hasChildren && selectedChildrenCount === children.length;
  const someChildrenSelected = hasChildren && selectedChildrenCount > 0 && !allChildrenSelected;

  const parentRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = someChildrenSelected;
  }, [someChildrenSelected]);

  const isParentChecked = selectedIds.includes(parent.id) || allChildrenSelected;

  return (
    <div className="space-y-3">
      {/* Parent */}
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-[14px] text-[#121212]">
          <input
            ref={parentRef}
            type="checkbox"
            checked={isParentChecked}
            onChange={() => onToggle(parent.id)}
            className="accent-[#003663] h-[14px] w-[14px]"
          />
          <span className="leading-[1.4]">
            {(() => {
              const base = parent.name_text ?? parent.name?.id ?? parent.slug;
              const aggregatedCount = aggregateParentCount(parent, children);
              const countText = Number.isFinite(aggregatedCount)
                ? new Intl.NumberFormat().format(aggregatedCount)
                : null;
              return countText ? `${base} (${countText})` : base;
            })()}
          </span>
        </label>

        {hasChildren ? (
          <button
            type="button"
            aria-label={toggleLabel}
            onClick={() => setIsOpen((v) => !v)}
            className="text-gray-500 hover:text-gray-700 transition p-1"
          >
            {isOpen ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 12l5-5 5 5H5z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 8l5 5 5-5H5z" />
              </svg>
            )}
          </button>
        ) : null}
      </div>

      {/* Children */}
      {hasChildren && isOpen ? (
        <ul className="ml-3 pl-3 border-l border-[#E5E7EB] space-y-2">
          {children.map((child) => (
            <li key={child.id}>
              <label className="inline-flex items-center gap-2 text-[14px] text-[#4B5563]">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(child.id)}
                  onChange={() => onToggle(child.id)}
                  className="accent-[#003663] h-[14px] w-[14px]"
                />
                <span className="leading-[1.4]">
                  {(() => {
                    const base = child.name_text ?? child.name?.id ?? child.slug;
                    const count = toCountValue(child.products_count);
                    const countText = count ? new Intl.NumberFormat().format(count) : null;
                    return countText ? `${base} (${countText})` : base;
                  })()}
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ---------- Parent list ---------- */
export default function CategoriesList({
  categories,
  selectedIds,
  onToggle,
  dictionary,
  totalCount, // tidak dipakai untuk "Semua Produk" lagi
  locale,
}: CategoriesListProps) {
  const safeCategories = categories ?? [];

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale ?? undefined), [locale]);
  const formatCount = (value?: number | null) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return numberFormatter.format(value);
    // Catatan: gunakan numberFormatter agar konsisten dengan locale
  };

  const groups = useMemo(() => buildGroups(safeCategories), [safeCategories]);

  /** === NEW: total semua produk (bukan yang dipilih) === */
  const totalAllProducts = useMemo(
    () =>
      groups.reduce((sum, g) => sum + aggregateParentCount(g.parent, g.children), 0),
    [groups]
  );

  const formattedTotal = formatCount(totalAllProducts);
  const allLabel = dictionary?.allProducts ?? "Semua Produk";
  const allProductsDisplay = formattedTotal ? `${allLabel} (${formattedTotal})` : allLabel;

  const emptyLabel = dictionary?.empty ?? "Kategori belum tersedia.";
  const toggleLabel = dictionary?.toggleLabel ?? "Toggle category";

  return (
    <div className={`${lato.className} space-y-4`}>
      {/* All Products + separator */}
      <div className="px-0">
        <div className="text-[14px] text-[#121212]/80">{allProductsDisplay}</div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px bg-[#E5E7EB] my-2 mx-[calc(var(--sidepad,1rem)*-1)]"
        />
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyLabel}</p>
      ) : null}

      <div className="space-y-4">
        {groups.map(({ parent, children }) => (
          <CategoryRow
            key={parent.id}
            parent={parent}
            children={children}
            selectedIds={selectedIds}
            onToggle={onToggle}
            toggleLabel={toggleLabel}
          />
        ))}
      </div>
    </div>
  );
}