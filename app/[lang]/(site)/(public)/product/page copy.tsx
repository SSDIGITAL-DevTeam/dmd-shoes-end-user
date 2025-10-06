// app/products/page.tsx (Next.js 13+ App Router)
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import CategoriesList from "./_components/CategoriesList"
import Container from "@/components/ui-custom/Container";
import FilterUkuran from "./_components/FilterUkuran";
import Pagination from "@/components/partials/pagination/PaginationDemo";
import Link from "next/link";
import ProductSort  from "./_components/ProductSort"
import ProductSortDesktop from "./_components/ProductSortDesktop"
const categories = [
  {
    name: "Hak",
    items: ["Hak Sepatu Bening", "Hak Sepatu 5A", "Hak Sepatu 5B"],
  },
  {
    name: "Outsole",
    items: ["Outsole Pria", "Outsole Wanita"],
  },
  {
    name: "Wedges",
    items: ["Wedges Sepatu"],
  },
  {
    name: "Lainnya",
    items: ["Gagang Golok", "Insole"],
  },
];

const products = [
  {
    id: 1,
    name: "Hak Sepatu Bening",
    code: "PC6601",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "hak-sepatu-bening",
  },
  {
    id: 2,
    name: "Outsole Siap Pakai",
    code: "OS 2188",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "outsole-siap-pakai",
  },
  {
    id: 3,
    name: "Wedges",
    code: "WS 9089",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "wedges",
  },
  {
    id: 4,
    name: "Insole",
    code: "IS 1919",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "insole",
  },
];

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  return (
    <div className="bg-[#F5F5F5]">
      <Container className=" py-8">
        {/* Header Filter */}
        {/* Header Filter */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          {/* Kiri */}
          <div className="w-full lg:w-auto flex justify-between lg:w-1/2 ">
            {/* Kiri */}
            
            <h2 className="text-[16px] lg:text-[40px] font-semibold text-gray-800 text-primary">
              Produk Kami
            </h2>

            {/* Kanan */}
            <div className="ml-16 flex items-center space-x-2">
              <ProductSort></ProductSort>
              {/* dektop view filter */}
             
            </div>
          </div>

          {/* Kanan */}
          <div className="w-full lg:w-auto flex flex-col lg:flex-row lg:items-center lg:space-x-3 mt-4 lg:mt-0 space-y-3 lg:space-y-0">
            {/* Search di atas saat mobile */}
            <div className="relative order-1 lg:order-2 lg:ml-3">
              <input
                type="text"
                placeholder="Cari Produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-[4px] px-3 py-2 pl-8 text-sm bg-white w-full"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-500 text-xs" />
            </div>

            {/* Filter ukuran */}
            <div className="w-full lg:w-auto  order-2 lg:order-1 flex space-x-[15px]">
              <button
                onClick={() => setOpenCategory(!openCategory)}
                className="w-1/2  lg:w-auto flex items-center border px-3 py-2 text-sm rounded-[4px] space-x-2 lg:hidden"
              >
                <Image
                  src="/assets/svg/icon/icon-category-filter.svg"
                  alt="Filter Icon"
                  width={16}
                  height={16}
                />
                <span className="font=-medium font-[28px] leading-[150%]">Filter Kategori</span>
              </button>
              <div className="w-1/2  lg:w-auto">
                <FilterUkuran />
           
              </div>
              
            </div>
          </div>
        </div>

        <div className="flex gap-6">
              {/* Sidebar */}

              {openCategory && (
  <div
    className="fixed inset-0 z-40 bg-black/40"
    onClick={() => setOpenCategory(false)}
  ></div>
)}

{/* Sidebar Filter */}
<aside
  className={`fixed top-0 right-0 h-full w-[320px] bg-white p-[32px] space-y-[16px]
    shadow-lg z-50 transform transition-transform 
    duration-300 ${
      openCategory ? "translate-x-0" : "translate-x-full"
    }`}
>
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold text-[#003663]">Kategori Produk</h3>
    <button
      onClick={() => setOpenCategory(false)}
      className="text-xl"
    >
      &times;
    </button>
  </div>

  <CategoriesList categories={categories}></CategoriesList>
</aside>
            {/* sidebar desktop */}
          <aside className="w-64  hidden lg:block bg-white p-[32px] space-y-[16px] ">
            <div >
              <h3 className="text-lg  text-primary font-semibold mb-3 lg:text-black">Kategori Produk</h3>
            </div>

            
     
            <CategoriesList categories={categories}></CategoriesList>
           
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((product) => (
               
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`} // arahkan ke slug
                    className="bg-white   flex flex-col   hover:shadow-md transition"
                  >
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain"
                      />
                      <div className="p-2 space-y-[4px]">
                          <h4 className=" font-semibold text-[#121212] font-[24px] leading-[130%]" >
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.code}</p>
                        <p className=" ">
                          <span className="font-semibold text-[#121212] font-[24px] leading-[130%]"> Rp {product.price.toLocaleString("id-ID")} /</span>
                           <span className=" text-[#121212] font-[20px] leading-[130%]">pasang</span>
                        </p>
                      </div>
                   
                  </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="justify-right">
              <Pagination align={"right"}></Pagination>
            </div>
            
         
          </main>
        </div>
      </Container>
    </div>
  );
}
