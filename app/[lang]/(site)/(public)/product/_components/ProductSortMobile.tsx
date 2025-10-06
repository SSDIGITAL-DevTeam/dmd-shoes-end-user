"use client";
import { useState } from "react";
import Image from "next/image";

function ProductSortMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Tombol Urutkan */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center text-[12px] leading-[150%] gap-1"
      >
        <u>Urutkan</u>
        <span>
          <Image
            src="/assets/svg/icon/icon-filter.svg"
            alt="Filter Icon"
            width={16}
            height={16}
            className="object-contain"
          />
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar Sort dari kanan */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#003663]">Urutkan Produk</h2>
          <button onClick={() => setOpen(false)} className="text-xl">
            &times;
          </button>
        </div>

        {/* Isi Sidebar dengan Select */}
        <div className="p-4 space-y-[8px]">
          <div className="text-primary text-[24px] leading-[130%]">
            Urutkan :
          </div>
          <div className="flex relative">
            <select className="bg-white border border-[#E0E0E0] px-3 py-2 pr-8 text-sm appearance-none w-full">
              <option>Produk Terpopuler</option>
              <option>Harga Terendah</option>
              <option>Harga Tertinggi</option>
            </select>
            {/* Chevron */}
            <svg
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
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

export default ProductSortMobile;
