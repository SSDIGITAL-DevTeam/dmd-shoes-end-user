"use client";

import type { HomepageHero } from "@/services/types";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { inter } from "@/config/font";

type HomeHeroProps = {
  lang: string;
  dict: any;
  hero?: HomepageHero;
};

const FALLBACK_DESKTOP = "/assets/images/home/banner.webp";
const FALLBACK_MOBILE = "/assets/images/home/banner-mobile.webp";

const resolveText = (dict: any, key: string, defaultValue: string) =>
  dict?.hero?.[key] ?? defaultValue;

export default function HomeHero({ lang, dict, hero }: HomeHeroProps) {
  const title = hero?.title ?? resolveText(dict, "title", "DMD Shoes");
  const subtitle =
    hero?.subtitle ??
    resolveText(
      dict,
      "subtitle",
      "Temukan koleksi terbaru dan terbaik kami untuk kebutuhan produksi sepatu Anda.",
    );
  const ctaLabel = hero?.cta_label ?? resolveText(dict, "cta", "Lihat Koleksi");
  const ctaHref = hero?.cta_href ?? `/${lang}/product`;
  const desktopImage = hero?.image_url ?? FALLBACK_DESKTOP;
  const mobileImage = hero?.image_url ?? FALLBACK_MOBILE;

  return (
    <div className={`relative w-full overflow-hidden ${inter.className}`}>
      {/* Desktop Hero */}
      <div className="relative hidden h-[540px] w-full lg:block">
        <Image
          src={desktopImage}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Mobile Hero */}
      <div className="relative block h-[380px] w-full lg:hidden">
        <Image
          src={mobileImage}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ===== Text Overlay ===== */}
      <div
        className="
          absolute top-1/2 left-1/2 z-10
          w-full -translate-x-1/2 -translate-y-1/2 px-6 text-left text-white
          lg:left-[144px] lg:w-1/2 lg:-translate-x-0 lg:-translate-y-1/2 lg:px-0
          flex flex-col space-y-4
        "
      >
        <h1 className="text-[28px] font-semibold leading-[130%] lg:text-[44px]">
          {title}
        </h1>

        <p className="text-[16px] leading-[150%] lg:text-[20px]">{subtitle}</p>

        <Link
          href={ctaHref}
          className="
            inline-flex items-center self-start bg-white
            px-6 py-3 text-[18px] font-semibold text-[#003663] transition
            hover:bg-gray-100 lg:text-[22px]
          "
        >
          {ctaLabel}
          <HiOutlineArrowRight className="ml-2 h-6 w-6 text-[#003663]" />
        </Link>
      </div>
    </div>
  );
}
