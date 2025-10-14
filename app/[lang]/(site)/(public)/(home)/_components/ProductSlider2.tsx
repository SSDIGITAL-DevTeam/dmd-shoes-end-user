"use client";

import ProductSliderListOne from "@/components/partials/product-slider/ProductSliderListOne";
import { SliderSkeleton } from "@/components/shared/Skeletons";
import type { HomepageSlider } from "@/services/types";
import React from "react";

type ProductSlider2Props = { images?: HomepageSlider[]; isLoading?: boolean };

const FALLBACK_IMAGES: HomepageSlider[] = [
  { id: 501, image_url: "/assets/demo/product-slider-2-images.webp" } as HomepageSlider,
  { id: 502, image_url: "/assets/demo/product-slider-2-images.webp" } as HomepageSlider,
];

const mapImages = (images: HomepageSlider[]) =>
  images.map((item) => ({ src: item.image_url, alt: `slider-${item.id}`, name: item.link_url ?? "" }));

export default function ProductSlider2({ images, isLoading }: ProductSlider2Props) {
  if (isLoading) return <SliderSkeleton />;

  const displayImages = images?.length ? mapImages(images) : mapImages(FALLBACK_IMAGES);

  return (
    <ProductSliderListOne
      images={displayImages}
      autoPlayInterval={4000}
      sliderHeightClass="aspect-video"
      imageClassName="object-cover"
    />
  );
}
