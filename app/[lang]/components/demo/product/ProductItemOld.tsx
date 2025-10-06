"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  promoPrice?: number | null;
};

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="bg-white  flex flex-col relative p-2">
      {/* Gambar + Nama Produk dengan Link */}
      <Link href={`/product/${product.slug}`} className="block relative">
        {/* Label "OBRAL" di kiri bawah jika ada promoPrice */}
      

        {/* Gambar Produk */}
        <div className="relative aspect-square w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover "
          />
          {/* {product.promoPrice && (
            <div
              className="absolute bg-primary text-white font-assistant rounded-[40px]"
              style={{
                bottom: "10px",
                left: "10px",
                lineHeight: "12px",
                letterSpacing: "1px",
                padding: "8px 14px",
              }}
            >
              OBRAL
            </div>
          )} */}
        </div>

        {/* Nama Produk */}
        <div
          className="mt-2 font-inter text-[13px]"
          style={{
            lineHeight: "16.9px",
            letterSpacing: "0.6px",
          }}
        >
          {product.name}
        </div>
      </Link>
          
      {/* Harga */}
      <div className="mt-2 flex items-center gap-2">
        {product.promoPrice ? (
          <>
            <span
              className="line-through font-assistant text-[13px] text-[#121212]/75"
              style={{
                lineHeight: "18.2px",
                letterSpacing: "1px",
              }}
            >
              Rp {product.price.toLocaleString("id-ID")}
            </span>
            <span
              className="font-assistant text-[13px] text-[#121212]"
              style={{
                lineHeight: "18.2px",
                letterSpacing: "1px",
              }}
            >
              Rp {product.promoPrice.toLocaleString("id-ID")}
            </span>
          </>
        ) : (
          <span
            className="font-assistant text-[13px] text-[#121212]"
            style={{
              lineHeight: "18.2px",
              letterSpacing: "1px",
            }}
          >
            Rp {product.price.toLocaleString("id-ID")}
          </span>
        )}
      </div>
    </div>
  );
}
