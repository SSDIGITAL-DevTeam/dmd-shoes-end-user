"use client";
import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type ImageObject = {
  src: string;
  alt?: string;
  name?: string;
};

type ProductSliderListProps = {
  productPreviews: ImageObject[]; // ✅ konsisten
  autoPlayInterval?: number;
};

function ProductSliderItem({ image }: { image: ImageObject }) {
  if (!image?.src) return <div className="w-full" />;
  return (
    <div className="w-full">
      <Image
        src={image.src}
        alt={image.alt || "product image"}
        width={1920}
        height={1080}
        className="w-full h-auto object-contain"
      />
    </div>
  );
}

export default function ProductPreviewSlider({
  productPreviews,
  autoPlayInterval = 3000,
}: ProductSliderListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSlides = productPreviews.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // ✅

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const togglePlay = () => setIsPlaying((p) => !p);

  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) return;
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // ✅ sertakan dependencies yang relevan
  }, [isPlaying, autoPlayInterval, totalSlides]);

  useEffect(() => {
    // reset index jika data berubah
    setCurrentIndex(0);
  }, [totalSlides]);

  return (
    <Container>
      <div className="flex overflow-hidden">
        <ProductSliderItem image={productPreviews[currentIndex]} />
      </div>

      <div className="flex items-center justify-center space-x-4 border-[1px] border-[#12121214]">
        <div className="py-2 flex items-center justify-center space-x-4">
          <button onClick={prevSlide} className="text-[rgba(18,18,18,0.75)]">
            <FaChevronLeft />
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${idx === currentIndex ? "bg-[#121212]" : "bg-[rgba(18,18,18,0.5)]"
                  }`}
              />
            ))}
          </div>

          <button onClick={nextSlide} className="text-[rgba(18,18,18,0.75)]">
            <FaChevronRight />
          </button>
        </div>
        <div className="py-2 border-l pl-2 border-l-[1px] border-l-[#12121214]">
          <button onClick={togglePlay} className="text-[rgba(18,18,18,0.75)]">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
    </Container>
  );
}
