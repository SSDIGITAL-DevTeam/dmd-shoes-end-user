"use client";

type SortOption = { label: string; value: string };

type ProductSortDesktopProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  label?: string; // contoh: "Sort :"
};

export default function ProductSortDesktop({
  value,
  options,
  onChange,
  label,
}: ProductSortDesktopProps) {
  const displayLabel = label ?? "Sort :";
  const selectId = "product-sort-desktop";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <label
        htmlFor={selectId}
        className="text-[15px] font-medium leading-none text-[#003663]"
      >
        {displayLabel}
      </label>

      <div className="relative">
        <select
          id={selectId}
          className="appearance-none rounded border border-[#E0E0E0] bg-white px-3 py-2 pr-8 text-sm leading-none focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort products"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
