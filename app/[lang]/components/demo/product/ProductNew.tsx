"use client";
import Link from "next/link";

import React from "react";
import ProductGrid from "./ProductGrid";

export default function ProductPromo() {
  const promoProducts = [
    {
        id: 1,
        name: "Product One",
        slug: "product-one",
        image: "/assets/demo/demo-product.png",
        price: 200000,
        promoPrice: null,
      },
      {
        id: 1,
        name: "Product One",
        slug: "product-one",
        image: "/assets/demo/demo-product.png",
        price: 200000,
        promoPrice: null,
      },
      {
        id: 1,
        name: "Product One",
        slug: "product-one",
        image: "/assets/demo/demo-product.png",
        price: 200000,
        promoPrice: null,
      },
      {
        id: 1,
        name: "Product One",
        slug: "product-one",
        image: "/assets/demo/demo-product.png",
        price: 200000,
        promoPrice: null,
      },
      
     
  ];

  return (
    <div className="container mx-auto px-3">
        <h2 className="text-[#003663] font-semibold text-center leading-[150%] text-[40px]">
        Koleksi Terbaru Kami
        </h2>
        <div className="mt-10"></div>
      <ProductGrid products={promoProducts} />
        
      <Link href="/tujuan-link" className="font-[Assistant] font-normal text-[24px] leading-[150%] tracking-[0.6px] inline-block text-center underline">
            Lihat semua
        </Link>

    </div>
  );
}
