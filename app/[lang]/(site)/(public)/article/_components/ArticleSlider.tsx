"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Container from "@/components/ui-custom/Container";
import ArticleItem, { Article } from "./ArticleItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const articles: Article[] = [
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image: "/assets/demo/article/article-item.webp",
  },
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image: "/assets/demo/article/article-item.webp",
  },
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image: "/assets/demo/article/article-item.webp",
  },
  {
    date: "28 April 2025",
    title: "Cara Memilih Sepatu yang Cocok Dengan Vibes Kamu",
    slug: "cara-memilih-sepatu-yang-cocok-dengan-vibes-kamu",
    image: "/assets/demo/article/article-item.webp",
  },
];

function ArticleSlider() {
  return (
    <Container>
      {/* Scoped wrapper */}
      <div
        className="relative article-slider 
        [&_.swiper-button-prev::after]:hidden 
        [&_.swiper-button-next::after]:hidden 
        [&_.swiper-button-prev]:!text-[#003663] 
        [&_.swiper-button-next]:!text-[#003663]
        [&_.swiper-pagination-bullet]:bg-[#003663] 
        [&_.swiper-pagination-bullet-active]:!bg-[#003663]"
      >
        {/* Tombol navigasi custom */}
        <div className="absolute top-1/2 -left-14 z-10 -translate-y-1/2">
          <button className="swiper-button-prev flex items-center justify-center size-[20px] !text-[#003663]">
            <FaChevronLeft size={10} />
          </button>
        </div>
        <div className="absolute top-1/2 -right-14 z-10 -translate-y-1/2">
          <button className="swiper-button-next flex items-center justify-center size-[20px] !text-[#003663]">
            <FaChevronRight size={10} />
          </button>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
          }}
          className="py-40"
        >
          {articles.map((article, index) => (
            <SwiperSlide key={index} className="pb-20">
              <ArticleItem article={article} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
}

export default ArticleSlider;
