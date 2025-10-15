"use client";

import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);         // panel
  const [listOpen, setListOpen] = useState(false); // dropdown
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });

  const triggerLabel = dictionary?.trigger ?? "Sort";
  const modalTitle = dictionary?.modalTitle ?? "Sort Products";
  const labelText = dictionary?.label ?? "Sort :";
  const closeLabel = dictionary?.close ?? "Close sort";

  const panelRef = useRef<HTMLDivElement>(null);
  const selectWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setListOpen(false); return; }
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => prev?.focus();
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!listOpen) return;
      if (!selectWrapRef.current?.contains(e.target as Node)) setListOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [listOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (listOpen) { setListOpen(false); return; }
      if (open) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, listOpen]);

  const currentLabel =
    options.find((o) => o.value === value)?.label ?? options[activeIdx]?.label ?? "";

  function choose(idx: number) {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setActiveIdx(idx);
    setListOpen(false);
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      {/* TRIGGER */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[16px] underline text-[#003663]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-sort-panel"
      >
        {triggerLabel}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M8 12h12M12 17h8" />
        </svg>
      </button>

      {/* OVERLAY */}
      {open && (
        <button
          aria-label="Close overlay"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* PANEL */}
      <div
        id="mobile-sort-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sort-title"
        ref={panelRef}
        tabIndex={-1}
        className={[
          "fixed top-0 z-50 h-full w-[320px] bg-white shadow-lg outline-none",
          "transition-[right] duration-300",
          open ? "right-0" : "-right-[320px]",
        ].join(" ")}
      >
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
          <h2 id="mobile-sort-title" className="text-lg font-semibold text-[#003663]">
            {modalTitle}
          </h2>
          <button type="button" onClick={() => setOpen(false)} className="text-xl" aria-label={closeLabel}>
            &times;
          </button>
        </div>

        {/* body */}
        <div className="p-4 space-y-4">{/* ← spacing 16px antar elemen */}
          <label className="text-[15px] font-medium text-[#003663] mb-2 block">
            {labelText}
          </label>

          {/* CUSTOM SELECT */}
          <div className="relative" ref={selectWrapRef}>
            {/* trigger button: tinggi 44px */}
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={listOpen}
              className="w-full h-11 rounded border border-[#E0E0E0] bg-white px-3 pr-8 text-sm text-left
                         focus:outline-none focus:ring-2 focus:ring-[#003663]/30"
              onClick={() => setListOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setListOpen(true); setActiveIdx((i) => Math.min(i + 1, options.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setListOpen(true); setActiveIdx((i) => Math.max(i - 1, 0)); }
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(activeIdx); }
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

            {/* listbox: jarak dari trigger 8px, item ≥44px */}
            {listOpen && (
              <ul
                role="listbox"
                tabIndex={-1}
                className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-auto rounded border border-[#E0E0E0] bg-white shadow-lg divide-y divide-[#F1F5F9]"
              >
                {options.map((opt, idx) => {
                  const selected = opt.value === value;
                  const active = idx === activeIdx;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={selected}
                      className={[
                        "cursor-pointer px-3 py-3 text-[15px] leading-5", // ← py-3 ≈ 44px height
                        active ? "bg-[#E6F0F8]" : "",
                        selected ? "font-medium" : "",
                      ].join(" ")}
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
      </div>
    </div>
  );
}
