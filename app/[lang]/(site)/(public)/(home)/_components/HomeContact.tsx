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
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 ">
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
            {dict?.contact?.heading}
          </h2>
          <p className="text-gray-600 mb-6">
            {dict?.contact?.subheading}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center bg-[#003663] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#002244] transition"
          >
            {dict?.contact?.button} <HiArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
      </Container>
    </section>
  );
}
