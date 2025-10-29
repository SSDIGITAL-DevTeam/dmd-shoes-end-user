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
  /** Tinggi/rasio area slider, ex: "aspect-slider-259" atau "aspect-[1990/768]" */
  sliderHeightClass?: string;
  /** Kelas untuk <Image/> */
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
  if (!image?.src) {
    return (
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-t-lg bg-black/5 min-h-[160px]",
          sliderHeightClass
        )}
      />
    );
  }

  const node = (
    <div
      className={clsx(
        "relative w-full overflow-hidden rounded-t-lg bg-black/5",
        "min-h-[160px]", // fallback supaya nggak 0px
        sliderHeightClass
      )}
    >
      <Image
        src={image.src}
        alt={image.alt || "product image"}
        fill
        sizes="100vw"
        className={clsx("w-full h-full", imageClassName ?? "object-cover")}
        priority={false}
      />
    </div>
  );

  return image.href ? (
    <Link
      href={image.href}
      className="block w-full"
      aria-label={image.alt ?? image.name ?? "slide"}
    >
      {node}
    </Link>
  ) : (
    <div className="w-full">{node}</div>
  );
}

/** Slider sederhana: autoplay + kontrol overlay (no external gap) */
export default function ProductSliderListOne({
  images,
  autoPlayInterval = 3000,
  // mobile lebih tinggi, md+ pakai rasio wide
  sliderHeightClass = "aspect-[16/10] sm:aspect-[21/9] md:aspect-[1990/768]",
  // mobile tidak crop, md+ full-bleed
  imageClassName = "object-contain md:object-cover",
}: ProductSliderListProps) {
  const filteredImages = useMemo(
    () => images.filter((img) => Boolean(img.src)),
    [images]
  );

  const totalSlides = filteredImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      totalSlides === 0 ? 0 : (prev + 1) % totalSlides
    );
  };
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      totalSlides === 0 ? 0 : (prev - 1 + totalSlides) % totalSlides
    );
  };
  const togglePlay = () => setIsPlaying((prev) => !prev);

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

  useEffect(() => {
    if (currentIndex >= totalSlides) setCurrentIndex(0);
  }, [currentIndex, totalSlides]);

  return (
    <Container>
      {/* Area gambar slider */}
      <div className="flex overflow-hidden rounded-t-lg">
        {totalSlides > 0 ? (
          <ProductSliderItem
            image={filteredImages[currentIndex]}
            sliderHeightClass={sliderHeightClass}
            imageClassName={imageClassName}
          />
        ) : (
          <div
            className={clsx(
              "relative w-full overflow-hidden rounded-t-lg bg-black/5 min-h-[160px]",
              sliderHeightClass
            )}
          />
        )}
      </div>

      {/* Kontrol */}
      <div className="flex items-center justify-center space-x-4 border border-[#12121214] rounded-b-lg">
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
              <div
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                className={clsx(
                  "h-2 w-2 rounded-full transition",
                  idx === currentIndex
                    ? "bg-[#121212]"
                    : "bg-[rgba(18,18,18,0.5)]"
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
