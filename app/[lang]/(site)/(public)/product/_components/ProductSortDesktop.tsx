"use client";

import { useEffect, useRef, useState } from "react";

type SortOption = { label: string; value: string };

type ProductSortDesktopProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  label?: string;         // e.g. "Urutkan :"
  widthClass?: string;    // default: "min-w-[160px]"
};

export default function ProductSortDesktop({
  value,
  options,
  onChange,
  label,
  widthClass = "min-w-[160px]",
}: ProductSortDesktopProps) {
  const displayLabel = label ?? "Urutkan :";

  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(() => {
    const idx = options.findIndex(o => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  const wrapRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    options.find(o => o.value === value)?.label ?? options[activeIdx]?.label ?? "";

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function choose(idx: number) {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setActiveIdx(idx);
    setOpen(false);
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <span className="text-[15px] font-medium leading-none text-[#003663]">
        {displayLabel}
      </span>

      <div className={`relative ${widthClass}`} ref={wrapRef}>
        {/* trigger */}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          className="h-[40px] w-full rounded-[4px] border border-[#003663] bg-white
                     px-3 pr-8 text-left text-sm leading-none text-[#003663]
                     focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
          onClick={() => setOpen(v => !v)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActiveIdx(i => Math.min(i + 1, options.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setActiveIdx(i => Math.max(i - 1, 0)); }
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(activeIdx); }
            if (e.key === "Escape") { setOpen(false); }
          }}
        >
          {currentLabel}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#003663]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* listbox */}
        {open && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded
                       border border-[#E0E0E0] bg-white shadow-lg"
          >
            {options.map((opt, idx) => {
              const selected = opt.value === value;
              const active = idx === activeIdx;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  className={`cursor-pointer px-3 py-2 text-sm
                             ${active ? "bg-[#E6F0F8]" : ""} ${selected ? "font-medium" : ""}`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => choose(idx)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
