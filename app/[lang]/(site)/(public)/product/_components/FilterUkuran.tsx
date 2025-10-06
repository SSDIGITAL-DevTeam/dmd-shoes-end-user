"use client";
import { useState } from "react";
import Image from "next/image";

export default function FilterUkuran() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Tombol Filter */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center border px-3 py-2 text-sm rounded-[4px] space-x-2 w-full lg:w-auto"
      >
        <Image
          src="/assets/images/product/filter-ukuran.svg"
          alt="Filter Icon"
          width={16}
          height={16}
        />
        <span className="font-medium text-[14px] leading-[150%]">
          Filter Ukuran
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar Filter dari kanan */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white 
          shadow-lg z-50 transform transition-transform 
          duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 ">
          <h2 className="text-lg font-semibold text-[#003663]">
            Filter Ukuran
          </h2>
          <button onClick={() => setOpen(false)} className="text-xl">
            &times;
          </button>
        </div>

        {/* Isi Filter */}
        <div className="space-y-6">
          {/* Filter Hak */}
          <div className="border-t border-t-[#121212]/25  p-[24px] ">
            <h3 className="font-medium text-[#121212]">
              Ukuran untuk produk Hak
            </h3>
            <p className="text-sm text-[#121212]/50 mt-[16px]">
              Min = 10cm
              <br />
              Max = 35cm
            </p>
            <div className="flex items-center space-x-2 mt-[24px]">
              <input
                type="number"
                placeholder="Dari"
                className="w-20 border rounded px-2 py-1 rounded-[4px] text-[20px]"
              />
              <span>cm</span>
              {/* Garis tengah */}
              <div className="w-4 h-[1px] bg-[#121212]"></div>
              <input
                type="number"
                placeholder="Sampai"
                className="w-24 border rounded px-2 py-1 rounded-[4px] text-[20px]"
              />
              <span>cm</span>
            </div>
          </div>

          {/* Filter Outsole */}
          <div className="border-t border-t-[#121212]/25 p-[24px] ">
            <h3 className="font-medium text-[#121212]">
              Ukuran untuk produk Outsole, Wedges
            </h3>
            <p className="text-sm text-[#121212]/50 mt-[16px]">
              Min = 36
              <br />
              Max = 40
            </p>
            <div className="flex items-center space-x-2 mt-[24px]">
              <input
                type="number"
                placeholder="Dari"
                className="w-20 border rounded px-2 py-1 rounded-[4px] text-[20px]"
              />
              <span>cm</span>
              {/* Garis tengah */}
              <div className="w-4 h-[1px] bg-[#121212]"></div>
              <input
                type="number"
                placeholder="Sampai"
                className="w-24 border rounded px-2 py-1 rounded-[4px] text-[20px]"
              />
              <span>cm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
