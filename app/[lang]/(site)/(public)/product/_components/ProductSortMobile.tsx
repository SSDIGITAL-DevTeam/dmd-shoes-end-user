"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type SortOption = { label: string; value: string };

type ProductSortMobileProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  dictionary?: {
    trigger?: string;
    modalTitle?: string;
    label?: string;
    close?: string;
  };
};

export default function ProductSortMobile({
  value,
  options,
  onChange,
  dictionary,
}: ProductSortMobileProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const triggerLabel = dictionary?.trigger ?? "Sort";
  const modalTitle = dictionary?.modalTitle ?? "Sort Products";
  const labelText = dictionary?.label ?? "Sort :";
  const closeLabel = dictionary?.close ?? "Close sort";
  const selectId = "product-sort-mobile";

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => prevActive?.focus();
  }, [open]);

  const handleChange = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[16px] underline text-[#003663]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-sort-panel"
      >
        {triggerLabel}
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"         // <- ikut warna teks
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* ikon “sort” tiga garis */}
          <path d="M4 7h16M8 12h12M12 17h8" />
        </svg>
      </button>

      {open && (
        <button
          aria-label="Close overlay"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="mobile-sort-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sort-title"
        ref={panelRef}
        tabIndex={-1}
        className={`fixed top-0 right-0 z-50 h-full w-[320px] transform bg-white shadow-lg outline-none transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 id="mobile-sort-title" className="text-lg font-semibold text-[#003663]">
            {modalTitle}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xl"
            aria-label={closeLabel}
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 p-4">
          <label htmlFor={selectId} className="text-[15px] font-medium text-[#003663]">
            {labelText}
          </label>
          <div className="relative">
            <select
              id={selectId}
              className="w-full appearance-none rounded border border-[#E0E0E0] bg-white px-3 py-2 pr-8 text-sm leading-none focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
      </div>
    </div>
  );
}
