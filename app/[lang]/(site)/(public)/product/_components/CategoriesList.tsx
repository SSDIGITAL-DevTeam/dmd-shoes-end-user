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

  const formattedTotal =
    typeof totalCount === "number" && Number.isFinite(totalCount)
      ? new Intl.NumberFormat(locale ?? undefined).format(totalCount)
      : null;
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
                <span>{parent.name_text ?? parent.name?.id ?? parent.slug}</span>
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
                        {child.name_text ?? child.name?.id ?? child.slug}
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
