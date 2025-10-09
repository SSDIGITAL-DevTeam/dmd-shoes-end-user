"use client";

type SortOption = {
  label: string;
  value: string;
};

type ProductSortDesktopProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  label?: string;
};

export default function ProductSortDesktop({
  value,
  options,
  onChange,
  label,
}: ProductSortDesktopProps) {
  const displayLabel = label ?? "Urutkan :";

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <span className="text-[24px] leading-[130%] text-primary">
        {displayLabel}
      </span>
      <div className="relative flex">
        <select
          className="appearance-none border border-[#E0E0E0] bg-white px-3 py-2 pr-8 text-sm"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
