"use client";

import type { HomepageHero } from "@/services/types";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
// pakai Poppins untuk heading, Inter untuk body
import { inter, poppins } from "@/config/font"; // pastikan ada; jika belum, lihat catatan di bawah

type HomeHeroProps = {
  lang: string;
  dict: any;
  hero?: HomepageHero;
};

const FALLBACK_DESKTOP = "/assets/images/home/banner.webp";
const FALLBACK_MOBILE = "/assets/images/home/banner-mobile.webp";

const resolveText = (dict: any, key: string, def: string) =>
  dict?.hero?.[key] ?? def;

export default function HomeHero({ lang, dict, hero }: HomeHeroProps) {
  const title = hero?.title ?? resolveText(dict, "title", "Solusi inovatif untuk komponen sepatu masa depan");
  const subtitle =
    hero?.subtitle ??
    resolveText(
      dict,
      "subtitle",
      "Dengan pengalaman manufaktur lebih dari 20 tahun, kami menghadirkan part sepatu yang kuat, presisi, dan ramah lingkungan untuk brand & pabrik sepatu di seluruh dunia."
    );
  const ctaLabel = hero?.cta_label ?? resolveText(dict, "cta", "Lihat Produk");
  const ctaHref = hero?.cta_href ?? `/${lang}/product`;
  const desktopImage = hero?.image_url ?? FALLBACK_DESKTOP;
  const mobileImage = hero?.image_url ?? FALLBACK_MOBILE;

  return (
    <div className={`relative w-full overflow-hidden ${inter.className}`}>
      {/* Desktop */}
      <div className="relative hidden h-[70vh] max-h-[600px] w-full lg:block">
        <Image src={desktopImage} alt={title} fill priority className="object-cover object-center" sizes="100vw" />
        {/* overlay gelap + gradient kiri → kanan */}
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" aria-hidden />
      </div>

      {/* Mobile */}
      <div className="relative block h-[68vh] max-h-[520px] w-full lg:hidden">
        <Image src={mobileImage} alt={title} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>

      {/* ===== Text Overlay (refined) ===== */}
      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-full px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1200px] text-white">
          <div className="max-w-[760px] md:max-w-[820px]">
            {/* Judul: normal-case, Inter, font-bold (bukan extrabold), lebih kecil */}
            <h1
              className={`${inter.className} uppercase font-semibold
              text-3xl md:text-5xl lg:text-[44px]
              leading-tight md:leading-[1.12] lg:leading-[1.08]
              tracking-[0.01em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}
            >
              {title}
            </h1>
            {/* Subtitle: ukuran turun, weight normal */}
            <p className={`${inter.className} mt-4 text-base md:text-[15px] lg:text-[17px]
                     font-normal leading-relaxed text-white/90
                     drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]`}>
              {subtitle}
            </p>

            {/* CTA: sedikit lebih kecil */}
            <Link
              href={ctaHref}
              className="mt-6 inline-flex items-center rounded-md bg-white
                   px-5 py-2.5 text-[15px] font-semibold text-[#0E3A5A]
                   shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              {ctaLabel}
              <HiOutlineArrowRight className="ml-2 h-5 w-5 text-[#0E3A5A]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
