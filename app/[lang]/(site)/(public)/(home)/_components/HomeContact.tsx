"use client";

import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import {inter} from "@/config/font"
export default function HomeContact(
  {lang, dict}:{lang:string; dict: any}
) {
  return (
    <section className={`bg-[#F5F5F5] py-12  ${inter.className}`}>
        <Container>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 ">
        {/* Gambar */}
        <div className="flex justify-center">
          <Image
            src="/assets/images/home/home-contact.webp" // ganti sesuai lokasi file kamu
            alt="Sepatu"
            width={400}
            height={300}
            className="object-contain"
            priority
          />
        </div>

        {/* Konten */}
        <div className="text-center md:text-left">
          <h2 className="mb-3 text-xl font-semibold text-gray-900 leading-snug md:text-2xl">
            {dict?.contact?.heading}
          </h2>
          <p className="mb-5 text-sm text-gray-600 md:text-base">
            {dict?.contact?.subheading}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center rounded-md bg-[#003663] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002244] md:px-5 md:py-2.5 md:text-[15px]"
          >
            {dict?.contact?.button} <HiArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      </Container>
    </section>
  );
}
