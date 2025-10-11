import React from 'react'
import Container from '@/components/ui-custom/Container'
import { getDictionaryAbout } from '../../../../../../dictionaries/about/get-dictionary-about';
import Image from "next/image";
export default function About({ lang, dictionaryAbout }: { lang: string, dictionaryAbout: Awaited<ReturnType<typeof getDictionaryAbout>> }) {

  return (
    <Container>
      {/* Kiri */}
      <div className="flex flex-col md:flex-row py-12 gap-8">
        {/* Kiri */}
        <div className="md:w-2/3 pr-0 md:pr-8 flex flex-col justify-center">
          <h1 className="text-primary font-semibold text-[32px] leading-[140%]">

            {dictionaryAbout.about.title || "Tentang kami"}
          </h1>
          <p className="text-[20px] leading-[150%] font-normal text-[#121212] text-justify">
            {
              dictionaryAbout.about.description ||
              "Kami adalah pabrik spesialis komponen sepatu yang berfokus pada produksi hak sepatu, outsole, dan insole berkualitas. Dengan teknologi modern dan material ramah lingkungan, kami menghadirkan solusi shoes parts yang presisi, terjangkau, dan cocok untuk berbagai skala produksi — dari workshop kecil hingga pabrik besar."
            }

          </p>
        </div>

        {/* Kanan */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          <img
            src="/assets/demo/demo-product.png"
            alt="Demo Product"
            className="w-full  aspect-square object-cover"
          />
        </div>
      </div>


      {/* Grid 2 kolom */}
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Image
            src="/assets/demo/product-demo-width.webp"
            alt="Product Demo 1"
            width={800}
            height={600}
            className="w-full h-auto                "
          />
        </div>
        <div>
          <Image
            src="/assets/demo/product-demo-width.webp"
            alt="Product Demo 2"
            width={800}
            height={600}
            className="w-full h-auto "
          />
        </div>
      </div>
    </Container>
  )
}
