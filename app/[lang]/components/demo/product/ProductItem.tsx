"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Inter, Assistant } from "next/font/google";

// Import Google Fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

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
    <div className={`${assistant.className} bg-white flex flex-col relative `}>
      {/* Gambar + Nama Produk dengan Link */}
      <Link href={`/product/${product.slug}`} className="block relative">
        {/* Gambar Produk */}
        <div className="relative aspect-square w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-[16px] space-y-1">
            <div
                className={`${inter.className} mt-2 text-[18px] font-semibold leading-[130%]`}
              
              >
                {product.name}
              </div>
          {/* Tambahkan teks "5A" */}
          <div className="mt-1 text-[18px] text-[#121212] leading-[130%]">5A</div>

          {/* Harga → tetap pakai Assistant */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-[14px] text-[#121212] leading-[130%]"
            
            >
              <b className="text-[16px]">Rp {product.price.toLocaleString("id-ID")}</b> / pasang
            </span>
          </div>

      </div>

        {/* Nama Produk → gunakan Inter */}
      
      </Link>
     

    
    </div>
  );
}
