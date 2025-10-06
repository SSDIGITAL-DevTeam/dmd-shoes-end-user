import React from "react";
import { Inter } from "next/font/google";
import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import { HiArrowNarrowRight } from "react-icons/hi";
import Link from "next/link";
import ArticleList from "./_components/ArticleList";
import ArticlePagination from "./_components/ArticlePagination";
import { AiOutlineSearch } from "react-icons/ai";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

function page() {
  

  return (
    <div className={` ${inter.className} bg-gray-100 min-h-screen`}>
      {/* Konten Artikel Terbaru */}
      <Container className="py-[40px]">
        <div className=" flex justify-between items-center">
          <h1 className="text-xl font-bold">Artikel Terbaru</h1>
          <div className="relative">
  <input
    type="text"
    placeholder="Cari Artikel..."
    className="
        w-full border text-[20px] 
        py-4 pr-4 pl-8
      "
    style={{
      borderColor: "rgba(18,18,18,0.25)",
      borderRadius: "0px",
    
      lineHeight: "20px",
    
    }}
  />
   <AiOutlineSearch
    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    size={18}
  />
</div>

        </div>
      </Container>
      {/* Header dengan background image */}
      {/* Header dengan background image */}
      <div
        className="relative h-[450px] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/demo/article/article-header.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Konten */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] sm:left-[158px] sm:translate-x-0 sm:w-auto">
          <div className="bg-white text-[#121212] py-[48px] px-[40px] max-w-lg space-y-32">
            <p
              className="mb-2 font-inter text-[14px] leading-[20px]"
              style={{ color: "#6D758F" }}
            >
              28 JULI 2025
            </p>
            <h2 className="text-[38px] font-semibold leading-[40px] text-[#121212] mb-4">
              Jangan Ketinggalan: Tren Sepatu Terpanas Musim Ini
            </h2>
            <Link
              href="#"
              className="inline-flex items-center gap-1 font-semibold text-[18px] leading-[22px] text-[#003663] border-b border-[#003663] pb-0.5 transition-opacity hover:opacity-80"
            >
              Baca Selengkapnya
              <HiArrowNarrowRight className="text-[18px]" />
            </Link>
          </div>
        </div>
      </div>
      <ArticleList></ArticleList>
      {/* pagination */}
      <Container>
        {/* Navigasi Halaman */}
        <ArticlePagination></ArticlePagination>
      </Container>
    </div>
  );
}

export default page;
