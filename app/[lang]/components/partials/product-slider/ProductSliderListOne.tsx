"use client";

import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type ImageObject = {
  src: string;
  alt?: string;
  name?: string;
  href?: string;
};

export type ProductSliderListProps = {
  images: ImageObject[];
  autoPlayInterval?: number;
  /** Tinggi responsif area gambar slider; boleh di-override dari pemanggil */
  sliderHeightClass?: string; // e.g. "h-[280px] md:h-[340px] lg:h-[420px]"
};

type ProductSliderItemProps = {
  image: ImageObject;
  sliderHeightClass: string;
};

/** Satu slide, gambar selalu cover + center dengan Next/Image fill */
function ProductSliderItem({ image, sliderHeightClass }: ProductSliderItemProps) {
  if (!image.src) {
    return <div className={`w-full bg-slate-100 ${sliderHeightClass}`} />;
  }

  const node = (
    <div className={`relative w-full ${sliderHeightClass}`}>
      <Image
        src={image.src}
        alt={image.alt || "product image"}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
    </div>
  );

  return image.href ? (
    <Link href={image.href} className="block w-full">
      {node}
    </Link>
  ) : (
    <div className="w-full">{node}</div>
  );
}

/** Slider sederhana: autoplay, prev/next, dots, play/pause */
export default function ProductSliderListOne({
  images,
  autoPlayInterval = 3000,
  sliderHeightClass = "h-[300px] md:h-[360px] lg:h-[440px]",
}: ProductSliderListProps) {
  const filteredImages = useMemo(
    () => images.filter((img) => Boolean(img.src)),
    [images],
  );

  const totalSlides = filteredImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (totalSlides === 0 ? 0 : (prev + 1) % totalSlides));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (totalSlides === 0 ? 0 : (prev - 1 + totalSlides) % totalSlides));
  };
  const togglePlay = () => setIsPlaying((prev) => !prev);

  // Autoplay
  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlayInterval, isPlaying, totalSlides]);

  // Pastikan index valid saat jumlah slide berubah
  useEffect(() => {
    if (currentIndex >= totalSlides) setCurrentIndex(0);
  }, [currentIndex, totalSlides]);

  return (
    <Container>
      {/* Area gambar slider */}
      <div className="flex overflow-hidden">
        {totalSlides > 0 ? (
          <ProductSliderItem
            image={filteredImages[currentIndex]}
            sliderHeightClass={sliderHeightClass}
          />
        ) : (
          <div className={`w-full bg-slate-100 ${sliderHeightClass}`} />
        )}
      </div>

      {/* Kontrol */}
      <div className="flex items-center justify-center space-x-4 border border-[#12121214]">
        <div className="py-2 flex items-center justify-center space-x-4">
          <button
            type="button"
            onClick={prevSlide}
            className="text-[rgba(18,18,18,0.75)] disabled:text-[#ccc]"
            disabled={totalSlides <= 1}
            aria-label="Sebelumnya"
          >
            <FaChevronLeft />
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === currentIndex ? "bg-[#121212]" : "bg-[rgba(18,18,18,0.5)]"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="text-[rgba(18,18,18,0.75)] disabled:text-[#ccc]"
            disabled={totalSlides <= 1}
            aria-label="Berikutnya"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="py-2 border-l pl-2 border-l-[#12121214]">
          <button
            type="button"
            onClick={togglePlay}
            className="text-[rgba(18,18,18,0.75)] disabled:text-[#ccc]"
            disabled={totalSlides <= 1}
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
    </Container>
  );
}
