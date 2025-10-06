"use client";

import Image from "next/image";
import React from "react";

type ProductSliderItemProps = {
  image: {
    src: string;
    alt?: string;
    name?: string;
  };
};

export default function ProductSliderItem({ image }: ProductSliderItemProps) {
  return (
    <div className=" relative  rounded overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt || image.name || "product"}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 33vw, 33vw"
      />
    </div>
  );
}
