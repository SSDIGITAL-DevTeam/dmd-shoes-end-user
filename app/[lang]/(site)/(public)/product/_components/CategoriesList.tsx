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
  if (parentCount > 0 && parentCount >= childTotal) return parentCount;
  return parentCount + childTotal;
};

const buildGroups = (categories: Category[]): GroupedCategory[] => {
  const parents = categories.filter((cat) => !cat.parent_id);
  const grouped: GroupedCategory[] = parents.map((parent) => ({
    parent,
    children: categories.filter((cat) => cat.parent_id === parent.id),
  }));

  const hasParent = new Set(categories.map((cat) => cat.parent_id).filter(Boolean) as number[]);
  const orphans = categories.filter((cat) => cat.parent_id && !hasParent.has(cat.parent_id));

  return [...grouped, ...orphans.map((cat) => ({ parent: cat, children: [] }))];
};

/* ---------- Child row component (hooks at top-level, not in a loop) ---------- */
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

  // Hitung state untuk checkbox parent
  const selectedChildrenCount = children.filter((c) => selectedIds.includes(c.id)).length;
  const allChildrenSelected = hasChildren && selectedChildrenCount === children.length;
  const someChildrenSelected = hasChildren && selectedChildrenCount > 0 && !allChildrenSelected;

  // Indeterminate via ref
  const parentRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = someChildrenSelected;
  }, [someChildrenSelected]);

  const isParentChecked = selectedIds.includes(parent.id) || allChildrenSelected;

  return (
    <div className="space-y-3">
      {/* Baris parent */}
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

      {/* Anak kategori */}
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

/* --------------------------------- Parent list -------------------------------- */
export default function CategoriesList({
  categories,
  selectedIds,
  onToggle,
  dictionary,
  totalCount,
  locale,
}: CategoriesListProps) {
  const safeCategories = categories ?? [];

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale ?? undefined), [locale]);
  const formatCount = (value?: number | null) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return numberFormatter.format(value);
  };

  const groups = useMemo(() => buildGroups(safeCategories), [safeCategories]);

  const formattedTotal = formatCount(totalCount);
  const allLabel = dictionary?.allProducts ?? "Semua Produk";
  const allProductsDisplay = formattedTotal ? `${allLabel} (${formattedTotal})` : allLabel;
  const emptyLabel = dictionary?.empty ?? "Kategori belum tersedia.";
  const toggleLabel = dictionary?.toggleLabel ?? "Toggle category";

  return (
    <div className={`${lato.className} space-y-4`}>
      {/* All Products + separator (full-bleed) */}
      <div className="px-0">
        <div className="text-[14px] text-[#121212]/80">{allProductsDisplay}</div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px bg-[#E5E7EB] my-2 mx-[calc(var(--sidepad,1rem)*-1)]"
        />
      </div>

      {safeCategories.length === 0 ? (
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
