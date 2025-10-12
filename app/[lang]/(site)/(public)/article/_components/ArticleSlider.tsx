"use client";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Container from "@/components/ui-custom/Container";
import ArticleItem from "./ArticleItem";
import type { Article } from "@/services/types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type ArticleSliderProps = {
  articles: Article[];
  lang: string;
  readMoreLabel: string;
};

function ArticleSlider({ articles, lang, readMoreLabel }: ArticleSliderProps) {
  const items = useMemo(
    () => articles.filter((article) => Boolean(article.slug ?? article.slug_id)),
    [articles],
  );

  if (!items.length) {
    return null;
  }

  return (
    <Container>
      <div
        className="relative article-slider [&_.swiper-button-prev::after]:hidden [&_.swiper-button-next::after]:hidden [&_.swiper-button-prev]:!text-[#003663] [&_.swiper-button-next]:!text-[#003663] [&_.swiper-pagination-bullet]:bg-[#003663] [&_.swiper-pagination-bullet-active]:!bg-[#003663]"
      >
        <div className="absolute top-1/2 -left-14 z-10 -translate-y-1/2">
          <button className="swiper-button-prev flex items-center justify-center size-[20px] !text-[#003663]" aria-label="Previous">
            <FaChevronLeft size={10} />
          </button>
        </div>
        <div className="absolute top-1/2 -right-14 z-10 -translate-y-1/2">
          <button className="swiper-button-next flex items-center justify-center size-[20px] !text-[#003663]" aria-label="Next">
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
          {items.map((article) => (
            <SwiperSlide key={article.slug ?? article.id} className="pb-20">
              <ArticleItem article={article} lang={lang} readMoreLabel={readMoreLabel} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
}

export default ArticleSlider;
