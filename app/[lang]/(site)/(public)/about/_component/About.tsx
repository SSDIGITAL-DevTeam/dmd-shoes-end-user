import React from "react";
import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import { getDictionaryAbout } from "../../../../../../dictionaries/about/get-dictionary-about";

export default function About({
  lang,
  dictionaryAbout,
}: {
  lang: string;
  dictionaryAbout: Awaited<ReturnType<typeof getDictionaryAbout>>;
}) {
  return (
    <Container>
      {/* Wrapper */}
      <section className="py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
          {/* Text */}
          <div className="w-full md:w-2/3 md:pr-8">
            <h1 className="text-primary font-semibold text-2xl leading-snug sm:text-3xl md:text-[32px] md:leading-[140%] text-left">
              {dictionaryAbout.about.title || "Tentang kami"}
            </h1>

            <p className="mt-3 sm:mt-4 text-base leading-[170%] sm:text-lg md:text-[20px] text-[#121212] text-left">
              {dictionaryAbout.about.description ||
                "Kami adalah pabrik spesialis komponen sepatu yang berfokus pada produksi hak sepatu, outsole, dan insole berkualitas. Dengan teknologi modern dan material ramah lingkungan, kami menghadirkan solusi shoes parts yang presisi, terjangkau, dan cocok untuk berbagai skala produksi — dari workshop kecil hingga pabrik besar."}
            </p>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/3">
            <div className="mx-auto md:mx-0 w-full max-w-[320px] sm:max-w-[380px]">
              <Image
                src="/assets/demo/demo-product.png"
                alt="Demo Product"
                width={800}
                height={800}
                className="w-full h-auto rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Grid gambar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Image
            src="/assets/demo/product-demo-width.webp"
            alt="Product Demo 1"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
            priority
          />
          <Image
            src="/assets/demo/product-demo-width.webp"
            alt="Product Demo 2"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </section>
    </Container>
  );
}
