"use client";

import ProductSliderListOne from "@/components/partials/product-slider/ProductSliderListOne";
import { SliderSkeleton } from "@/components/shared/Skeletons";
import type { HomepageSlider } from "@/services/types";
import React from "react";

type ProductSlider1Props = { images?: HomepageSlider[]; isLoading?: boolean };

const FALLBACK_IMAGES: HomepageSlider[] = [
  { id: 401, image_url: "/assets/demo/product-slider-3-images.webp" } as HomepageSlider,
  { id: 402, image_url: "/assets/demo/product-slider-3-images.webp" } as HomepageSlider,
  { id: 403, image_url: "/assets/demo/product-slider-3-images.webp" } as HomepageSlider,
  { id: 404, image_url: "/assets/demo/product-slider-3-images.webp" } as HomepageSlider,
];

const mapImages = (images: HomepageSlider[]) =>
  images.map((item) => ({ src: item.image_url, alt: `slider-${item.id}`, name: item.link_url ?? "" }));

export default function ProductSlider1({ images, isLoading }: ProductSlider1Props) {
  if (isLoading) return <SliderSkeleton />;

  const displayImages = images?.length ? mapImages(images) : mapImages(FALLBACK_IMAGES);

  return (
    <ProductSliderListOne
      images={displayImages}
      sliderHeightClass = "aspect-[1990/768]"
      imageClassName="object-cover"
    />
  );
}
