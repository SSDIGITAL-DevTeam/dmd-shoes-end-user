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
  images: ImageObject[];
  autoPlayInterval?: number;
};

type ProductSliderItemProps = {
  image: ImageObject;
};

function ProductSliderItem({ image }: ProductSliderItemProps) {
  if (!image.src) {
    return <div className="w-full"></div>;
  }

  return (
    <div className="w-full">
      <Image
        src={image.src}
        alt={image.alt || "product image"}
        width={1920}   // kasih width besar
        height={1080}  // kasih default height
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex]);

  return (
    <Container>
      {/* Slider items */}
      <div className="flex overflow-hidden">
        <ProductSliderItem image={productPreviews[currentIndex]} />
      </div>

      {/* Navigasi */}
      <div
        className="flex items-center justify-center space-x-4 
                   border-[1px] border-[#12121214] "
      >
        <div className="py-2 flex items-center justify-center space-x-4">
          <button
            onClick={prevSlide}
            className="text-[rgba(18,18,18,0.75)]"
          >
            <FaChevronLeft />
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === currentIndex
                    ? "bg-[#121212]"
                    : "bg-[rgba(18,18,18,0.5)]"
                }`}
              ></span>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="text-[rgba(18,18,18,0.75)]"
          >
            <FaChevronRight />
          </button>
        </div>
        <div
          className="py-2 border-l pl-2
                  border-l-[1px] border-l-[#12121214]"
        >
          <button
            onClick={togglePlay}
            className="text-[rgba(18,18,18,0.75)]"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
    </Container>
  );
}
