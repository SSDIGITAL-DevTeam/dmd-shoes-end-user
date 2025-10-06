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
    return (
      <div className="flex-1  aspect-square"></div>
    );
  }

  return (
    <div className="flex-1 p-1 relative  aspect-square overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt || "product image"}
        fill
        style={{ objectFit: "cover" }}
        className=""
      />
    </div>
  );
}

export default function ProductSliderList({
  images,
  autoPlayInterval = 3000,
}: ProductSliderListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSlides = Math.ceil(images.length / 3);
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

  const getSlideImages = (index: number) => {
    const start = index * 3;
    const slice = images.slice(start, start + 3);
    while (slice.length < 3) {
      slice.push({ src: "", alt: "placeholder" });
    }
    return slice;
  };

  return (
    <Container>
      
      {/* Slider items */}
      <div className="flex  overflow-hidden">
        {getSlideImages(currentIndex).map((img, idx) => (
          <ProductSliderItem key={idx} image={img} />
        ))}
      </div>

      {/* Navigasi */}
      <div
        className="flex items-center justify-center space-x-4 
                 
                  border-[1px] border-[#12121214] "
      >
        <div className="py-2 flex items-center justify-center space-x-4">

        
          <button
            onClick={prevSlide}
            className="text-[rgba(18,18,18,0.75)]  "
          >
            <FaChevronLeft />
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === currentIndex
                    ? "bg-[#121212]"               // active full opacity
                    : "bg-[rgba(18,18,18,0.5)]"   // inactive 50% opacity
                }`}
              ></span>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="text-[rgba(18,18,18,0.75)] "
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="py-2 border-l pl-2
                  border-l-[1px] border-l-[#12121214]">
          <button
            onClick={togglePlay}
            className="text-[rgba(18,18,18,0.75)]   "
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          </div>
      </div>
   
    </Container>
  );
}
