"use client";

import React from "react";
import ProductGrid from "./ProductGrid";
import Container from "@/components/ui-custom/Container";
import Link from "next/link";
import { Assistant } from "next/font/google";
const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});
export default function ProductPromo({lang}:{lang:string}) {
  const promoProducts = [
    {
      id: 1,
      name: "Product One",
      slug: "product-one",
      image: "/assets/demo/demo-product.png",
      price: 200000,
      promoPrice: 150000,
    },
    {
      id: 3,
      name: "Product Three",
      slug: "product-three",
      image: "/assets/demo/demo-product.png",
      price: 250000,
      promoPrice: 200000,
    },
    {
        id: 1,
        name: "Product One",
        slug: "product-one",
        image: "/assets/demo/demo-product.png",
        price: 200000,
        promoPrice: 150000,
      },
      {
        id: 3,
        name: "Product Three",
        slug: "product-three",
        image: "/assets/demo/demo-product.png",
        price: 250000,
        promoPrice: 200000,
      },
     
  ];

  return (
    <Container className="space-y-[28px]">
      <h2
          className="
            font-bold 
            text-[32px] 
            leading-[130%] 
            text-primary
            text-center
          "
        >
          Produk Unggulan
      </h2>
      <ProductGrid products={promoProducts} />
      <div className="flex">
        <Link href={`/${lang}/product`} 
         className={`${assistant.className} w-full justify-center ] font-normal text-[24px] leading-[150%] tracking-[0.6px] inline-block text-center underline`}>
             Lihat semua produk
        </Link>
      </div>
     
    </Container>
  );
}
