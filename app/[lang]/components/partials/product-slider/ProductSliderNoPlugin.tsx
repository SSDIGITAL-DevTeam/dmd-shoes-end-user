"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductSliderItem from "./ProductSliderItem";

type ImageObject = {
  src: string;
  alt?: string;
  name?: string;
};

type ProductSliderListProps = {
  images: ImageObject[];
  autoPlayInterval?: number;
};

export default function ProductSliderList({ images, autoPlayInterval = 3000 }: ProductSliderListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSlides = Math.ceil(images.length / 3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
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

  const getSlideImages = (index: number) => {
    const start = index * 3;
    return images.slice(start, start + 3);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Slider items */}
      <div className="flex overflow-hidden rounded-lg">
        {getSlideImages(currentIndex).map((img, idx) => (
          <ProductSliderItem key={idx} image={img} />
        ))}
      </div>

      {/* Navigasi titik + tombol prev/next + play/pause */}
      <div className="flex items-center justify-center mt-3 space-x-4">
        {/* Tombol prev */}
        <button
          onClick={prevSlide}
          className="p-2 bg-white rounded shadow hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        {/* Titik navigasi */}
        <div className="flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <span
              key={idx}
              className={`h-2 w-2 rounded-full ${idx === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
            ></span>
          ))}
        </div>

        {/* Tombol next */}
        <button
          onClick={nextSlide}
          className="p-2 bg-white rounded shadow hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>

        {/* Tombol play/pause */}
        <button
          onClick={togglePlay}
          className="p-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
}
