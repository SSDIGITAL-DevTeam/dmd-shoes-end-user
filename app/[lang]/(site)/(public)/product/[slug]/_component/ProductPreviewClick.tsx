"use client";
import { useState } from "react";
import Image from "next/image";

type ProductVariation = {
  id: string;
  value: string;
  price: number;
  image: string;
  description: string;
};


export default function ProductDetail({
  productPreviews,
  productPreviewSelection,
  setProductPreviewSelection,
}) {


  const handleVariationChange = (variation: ProductVariation) => {
    setProductPreviewSelection(variation);
  };

  return (
    <div className="">
      {/* Pilihan Variasi */}
      <div className="flex gap-4 mb-8">
        {productPreviews.map((variation) => (
          <div
            key={variation.id}
            onClick={() => handleVariationChange(variation)}
            className={`cursor-pointer flex flex-col items-center justify-center rounded-lg transition overflow-hidden
              ${
                productPreviewSelection.id === variation.id
                  ? "border-2 border-primary"
                  : "border-none hover:border-primary"
              }`}
          >
            <Image
              src={variation.path}
              alt={variation.alt}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
