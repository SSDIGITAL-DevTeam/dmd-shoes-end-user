import React from 'react'
import Image from "next/image";
import Link from "next/link";

import { HiOutlineArrowRight } from "react-icons/hi2";
function HomeHero() {
  return (
    <div className="relative w-full">
    <Image
      src="/assets/images/home/banner.webp"
      alt="Demo Banner"
      width={0}
      height={0}
      sizes="100vw"
      className="hidden lg:flex w-full h-auto"
    />

    <Image
      src="/assets/images/home/banner-mobile.webp"
      alt="Demo Banner"
      width={0}
      height={0}
      sizes="100vw"
      className=" lg:hidden w-full h-auto"
    />

    {/* Overlay Content */}
    <div
      className="
        absolute text-[#003663] 
        flex flex-col space-y-4
        w-full 
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        text-center
        
        lg:w-1/2 
        lg:left-[144px] 
        lg:top-1/2 lg:-translate-y-1/2 
        lg:translate-x-0 
        lg:text-left 
        p-4 lg:p-0
      "
    >
      <h2
        className="
    font-semibold 
    text-[28px] leading-[130%]
    lg:text-[44px]
    font-inter
    text-white
  "
      >
        Solusi inovatif untuk komponen sepatu masa depan
      </h2>

      <p
        className="
    text-[16px] leading-[150%]
    lg:text-[20px]
    font-inter
    text-white
  "
      >
        Dengan pengalaman manufaktur lebih dari 20 tahun, kami menghadirkan
        part sepatu yang kuat, presisi, dan ramah lingkungan untuk brand &
        pabrik sepatu di seluruh dunia
      </p>

      <Link
        href="#produk"
        className="
          inline-flex items-center
          bg-white
          px-6 py-3
          text-[18px] lg:text-[22px]
          font-semibold font-inter
          text-[#003663]
          w-auto
          self-start
        "
      >
        Lihat Produk
        <HiOutlineArrowRight className="ml-2 h-6 w-6 text-[#003663]" />
      </Link>
    </div>
  </div>
  )
}

export default HomeHero