import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { inter } from "@/config/font"; // ⬅️ import font

function HomeHero({ lang, dict }: { lang: string; dict: any }) {
  return (
    <div className={`relative w-full ${inter.className}`}>
      {/* Desktop Banner */}
      <Image
        src="/assets/images/home/banner.webp"
        alt="Demo Banner"
        width={0}
        height={0}
        sizes="100vw"
        className="hidden lg:flex w-full h-auto"
      />

      {/* Mobile Banner */}
      <Image
        src="/assets/images/home/banner-mobile.webp"
        alt="Demo Banner"
        width={0}
        height={0}
        sizes="100vw"
        className="lg:hidden w-full h-auto"
      />

      {/* Overlay Content */}
      <div
        className="
          absolute text-[#003663] 
          flex flex-col space-y-4
          w-full 
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          text-left
          lg:w-1/2 
          lg:left-[144px] 
          lg:top-1/2 lg:-translate-y-1/2 
          lg:translate-x-0 
          px-10 lg:p-0
        "
      >
        <h1
          className="
            font-semibold 
            text-[28px] leading-[130%]
            lg:text-[44px]
            text-white
          "
        >
          {dict?.hero?.title}
        </h1>

        <p
          className="
            text-[16px] leading-[150%]
            lg:text-[20px]
            text-white
          "
        >
          {dict?.hero?.subtitle}
        </p>

        <Link
          href={`/${lang}/product`}
          className="
            inline-flex items-center
            bg-white
            px-6 py-3
            text-[18px] lg:text-[22px]
            font-semibold
            text-[#003663]
            self-start
          "
        >
          {dict?.hero?.cta}
          <HiOutlineArrowRight className="ml-2 h-6 w-6 text-[#003663]" />
        </Link>
      </div>
    </div>
  );
}

export default HomeHero;
