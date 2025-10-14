"use client";

import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
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
  const childTotal = children.reduce(
    (sum, child) => sum + toCountValue(child.products_count),
    0,
  );

  if (parentCount > 0 && parentCount >= childTotal) {
    return parentCount;
  }

  return parentCount + childTotal;
};

const buildGroups = (categories: Category[]): GroupedCategory[] => {
  const parents = categories.filter((cat) => !cat.parent_id);
  const grouped: GroupedCategory[] = parents.map((parent) => ({
    parent,
    children: categories.filter((cat) => cat.parent_id === parent.id),
  }));

  const hasParent = new Set(categories.map((cat) => cat.parent_id).filter(Boolean) as number[]);
  const orphans = categories.filter(
    (cat) => cat.parent_id && !hasParent.has(cat.parent_id),
  );

  return [
    ...grouped,
    ...orphans.map((cat) => ({ parent: cat, children: [] })),
  ];
};

export default function CategoriesList({
  categories,
  selectedIds,
  onToggle,
  dictionary,
  totalCount,
  locale,
}: CategoriesListProps) {
  const [open, setOpen] = useState<number[]>([]);

  const safeCategories = categories ?? [];

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale ?? undefined),
    [locale],
  );

  const formatCount = (value?: number | null) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return numberFormatter.format(value);
  };

  const groups = useMemo(
    () => buildGroups(safeCategories),
    [safeCategories],
  );

  const toggle = (id: number) => {
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggle = (id: number) => () => onToggle(id);

  const formattedTotal = formatCount(totalCount);
  const allLabel = dictionary?.allProducts ?? "Semua Produk";
  const allProductsDisplay = formattedTotal
    ? `${allLabel} (${formattedTotal})`
    : allLabel;
  const emptyLabel = dictionary?.empty ?? "Kategori belum tersedia.";
  const toggleLabel = dictionary?.toggleLabel ?? "Toggle category";

  return (
    <div className={`${lato.className} space-y-[16px]`}>
      <div className="text-[14px] text-[#121212]/80">
        {allProductsDisplay}
      </div>

      {safeCategories.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyLabel}</p>
      ) : null}

      {groups.map(({ parent, children }) => {
        const isOpen = open.includes(parent.id);
        const hasChildren = children.length > 0;
        return (
          <div key={parent.id} className="space-y-[12px]">
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(parent.id)}
                  onChange={handleToggle(parent.id)}
                  className="accent-[#003663]"
                />
                <span>
                  {(() => {
                    const base = parent.name_text ?? parent.name?.id ?? parent.slug;
                    const aggregatedCount = aggregateParentCount(parent, children);
                    const countText = formatCount(aggregatedCount);
                    return countText ? `${base} (${countText})` : base;
                  })()}
                </span>
              </label>
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={toggleLabel}
                  onClick={() => toggle(parent.id)}
                  className="text-gray-500 transition hover:text-gray-700"
                >
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              ) : null}
            </div>
            {hasChildren && isOpen ? (
              <ul className="ml-[12px] space-y-2 border-l border-l-[#CCCCCC] pl-[12px]">
                {children.map((child) => (
                  <li key={child.id}>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(child.id)}
                        onChange={handleToggle(child.id)}
                        className="accent-[#003663]"
                      />
                      <span>
                        {(() => {
                          const base = child.name_text ?? child.name?.id ?? child.slug;
                          const countText = formatCount(child.products_count);
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
      })}
    </div>
  );
}
