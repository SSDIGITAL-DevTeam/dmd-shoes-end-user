// components/HelpSection.js
"use client";

import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import Container from "@/components/ui-custom/Container";
import { getDictionaryAbout } from "../../../../../../dictionaries/about/get-dictionary-about";
import Link from "next/link";

export default function HelpSection({
  lang,
  dictionaryAbout,
}: {
  lang: string;
  dictionaryAbout: Awaited<ReturnType<typeof getDictionaryAbout>>;
}) {
  return (
    // Wrapper utama: atas visible, bawah hidden
    <div className="relative bg-gray-100  z-10 overflow-visible">
      <Container>
        <div className="relative flex flex-col ">
          <div className="w-[300px] h-auto order-last mx-auto md:order-none md:mx-0 md:absolute md:bottom-0 md:right-0 z-10">
            <Image
              src="/assets/images/about/customer-service-girl.webp"
              alt="Petugas layanan pelanggan"
              width={334}
              height={445}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between relative overflow-visible">
            {/* Right section: Image */}

            {/* Left section: Text and Button */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 order-2 md:order-1 text-center md:text-left z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {dictionaryAbout.contactSupport.title || "Butuh Bantuan?"}
              </h2>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto md:mx-0">
                {dictionaryAbout.contactSupport.description ||
                  " Kirimkan pertanyaan Anda, dan tim layanan pelanggan kami akan segera membantu."}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-primary rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                {dictionaryAbout.contactSupport.button || "  Hubungi Kami"}

                <HiArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
