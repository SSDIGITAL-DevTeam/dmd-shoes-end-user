"use client";

import { useState } from "react";
import Image from "next/image";

type SortOption = {
  label: string;
  value: string;
};

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

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const triggerLabel = dictionary?.trigger ?? "Urutkan";
  const modalTitle = dictionary?.modalTitle ?? "Urutkan Produk";
  const labelText = dictionary?.label ?? "Urutkan :";
  const closeLabel = dictionary?.close ?? "Tutup sort";
  const iconAlt = dictionary?.trigger
    ? `${dictionary.trigger} icon`
    : "Sort icon";

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[12px] leading-[150%]"
      >
        <u>{triggerLabel}</u>
        <span>
          <Image
            src="/assets/svg/icon/icon-filter.svg"
            alt={iconAlt}
            width={16}
            height={16}
            className="object-contain"
          />
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[320px] transform bg-white shadow-lg transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-[#003663]">
            {modalTitle}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-xl"
            aria-label={closeLabel}
          >
            &times;
          </button>
        </div>

        <div className="space-y-[8px] p-4">
          <div className="text-[24px] leading-[130%] text-primary">
            {labelText}
          </div>
          <div className="relative flex">
            <select
              className="w-full appearance-none border border-[#E0E0E0] bg-white px-3 py-2 pr-8 text-sm"
              value={value}
              onChange={(event) => handleChange(event.target.value)}
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
      </div>
    </div>
  );
}
