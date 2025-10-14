"use client";

import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import clsx from "clsx";

type ImageObject = {
  src: string;
  alt?: string;
  name?: string;
  href?: string;
};

export type ProductSliderListProps = {
  images: ImageObject[];
  autoPlayInterval?: number;
  /** Tinggi responsif area gambar slider; override dari parent. Contoh: "aspect-video md:h-[360px] lg:h-[440px]" */
  sliderHeightClass?: string;
  /** Kelas untuk <Image/>: default mobile contain (no crop), desktop cover (full-bleed) */
  imageClassName?: string;
};

type ProductSliderItemProps = {
  image: ImageObject;
  sliderHeightClass: string;
  imageClassName?: string;
};

/** Satu slide */
function ProductSliderItem({
  image,
  sliderHeightClass,
  imageClassName,
}: ProductSliderItemProps) {
  if (!image.src) {
    return <div className={clsx("w-full bg-slate-100", sliderHeightClass)} />;
  }

  const node = (
    <div className={clsx("relative w-full overflow-hidden bg-black/5", sliderHeightClass)}>
      <Image
        src={image.src}
        alt={image.alt || "product image"}
        fill
        sizes="100vw"
        className={clsx("w-full h-full", imageClassName ?? "object-contain md:object-cover")}
        priority={false}
      />
    </div>
  );

  return image.href ? (
    <Link href={image.href} className="block w-full" aria-label={image.alt ?? image.name ?? "slide"}>
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
  sliderHeightClass = "aspect-video md:h-[360px] lg:h-[440px]", // 16:9 di mobile, fixed height di md+
  imageClassName = "object-contain md:object-cover", // Mobile tidak crop, Desktop cover
}: ProductSliderListProps) {
  const filteredImages = useMemo(() => images.filter((img) => Boolean(img.src)), [images]);

  const totalSlides = filteredImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
            imageClassName={imageClassName}
          />
        ) : (
          <div className={clsx("w-full bg-slate-100", sliderHeightClass)} />
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

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={clsx(
                  "h-2 w-2 rounded-full transition",
                  idx === currentIndex ? "bg-[#121212]" : "bg-[rgba(18,18,18,0.5)] hover:bg-[rgba(18,18,18,0.7)]"
                )}
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
