"use client";

import type { HomepageHero } from "@/services/types";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { inter } from "@/config/font";
import clsx from "clsx";

type HomeHeroProps = {
  lang: string;
  dict: any;
  hero?: HomepageHero;
  className?: string;
  heightClass?: string; // default disediakan di bawah
};

const FALLBACK_DESKTOP = "/assets/images/home/banner.webp";
const FALLBACK_MOBILE = "/assets/images/home/banner-mobile.webp";

const resolveText = (dict: any, key: string, def: string) =>
  dict?.hero?.[key] ?? def;

export default function HomeHero({
  lang,
  dict,
  hero,
  className,
  heightClass = "h-[64vh] max-h-[520px] lg:h-[70vh] lg:max-h-[600px]",
}: HomeHeroProps) {
  const title =
    hero?.title ??
    resolveText(dict, "title", "Solusi inovatif untuk komponen sepatu masa depan");
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
  const mobileImage = hero?.mobile_image_url ?? hero?.image_url ?? FALLBACK_MOBILE;

  return (
    <section className={clsx("relative w-full overflow-hidden", inter.className, className)}>
      {/* Desktop */}
      <div className={clsx("relative hidden w-full lg:block", heightClass)}>
        <Image
          src={desktopImage}
          alt={title}
          fill
          loading="eager"
          fetchPriority="high"
          quality={70}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent"
          aria-hidden
        />
      </div>

      {/* Mobile */}
      <div className={clsx("relative block w-full lg:hidden", heightClass)}>
        <Image
          src={mobileImage}
          alt={title}
          fill
          priority
          fetchPriority="high"
          quality={70}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>

      {/* Overlay teks */}
      <div className="absolute left-1/2 top-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1200px] text-white">
          <div className={clsx(
            "max-w-[760px] md:max-w-[820px]",
            // center di mobile, left di desktop
            "text-center lg:text-left"
          )}>
            <h1
              className="uppercase font-semibold
                         text-3xl md:text-5xl lg:text-[44px]
                         leading-tight md:leading-[1.12] lg:leading-[1.08]
                         tracking-[0.01em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            >
              {title}
            </h1>
            <p
              className="mt-4 text-base md:text-[15px] lg:text-[17px]
                         font-normal leading-relaxed text-white/90
                         drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]"
            >
              {subtitle}
            </p>

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
    </section>
  );
}
