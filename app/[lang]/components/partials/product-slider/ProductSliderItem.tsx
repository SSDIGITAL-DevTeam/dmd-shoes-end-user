"use client";

import Image from "next/image";
import React from "react";
import clsx from "clsx";

type ProductSliderItemProps = {
  image: {
    src: string;
    alt?: string;
    name?: string;
  };
  /** tinggi/rasio wrapper gambar */
  heightClass?: string;          // contoh: "aspect-[1990/768]" atau "aspect-video"
  /** kelas tambahan utk <Image/> */
  imageClassName?: string;       // contoh: "object-cover"
};

export default function ProductSliderItem({
  image,
  heightClass = "aspect-[1990/768]",   // rasio 1990x768 (~2.591:1), sama di mobile & desktop
  imageClassName = "object-cover",
}: ProductSliderItemProps) {
  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden rounded-t-lg",
        "min-h-[160px]",          // fallback biar gak 0px saat CSS belum ke-load
        heightClass
      )}
    >
      <Image
        src={image.src}
        alt={image.alt || image.name || "product"}
        fill
        sizes="100vw"
        className={imageClassName}
        priority={false}
      />
    </div>
  );
}
