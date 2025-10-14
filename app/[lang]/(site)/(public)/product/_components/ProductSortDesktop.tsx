"use client";

type SortOption = { label: string; value: string };

type ProductSortDesktopProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  label?: string; // contoh: "Urutkan :"
  /** opsional: samakan lebar dengan Filter Ukuran (ubah sesuai kebutuhan) */
  widthClass?: string; // default: "min-w-[160px]"
};

export default function ProductSortDesktop({
  value,
  options,
  onChange,
  label,
  widthClass = "min-w-[160px]",
}: ProductSortDesktopProps) {
  const displayLabel = label ?? "Urutkan :";
  const selectId = "product-sort-desktop";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <label
        htmlFor={selectId}
        className="text-[15px] font-medium leading-none text-[#003663]"
      >
        {displayLabel}
      </label>

      <div className={`relative ${widthClass}`}>
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort products"
          className="
            h-[40px] w-full appearance-none
            rounded-[4px] border border-[#003663]
            bg-white text-[#003663]
            px-3 pr-8 text-sm leading-none
            focus:outline-none focus:ring-2 focus:ring-[#003663]/30
          "
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* caret */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#003663]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
