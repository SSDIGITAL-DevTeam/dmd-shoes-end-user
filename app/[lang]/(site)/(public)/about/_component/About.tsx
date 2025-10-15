import React from "react";
import Container from "@/components/ui-custom/Container";
import { getDictionaryAbout } from "../../../../../../dictionaries/about/get-dictionary-about";
import AboutPhoto from "./shared/AboutPhoto";

export default function About({
  lang,
  dictionaryAbout,
}: {
  lang: string;
  dictionaryAbout: Awaited<ReturnType<typeof getDictionaryAbout>>;
}) {
  const title = dictionaryAbout?.about?.title || "Tentang kami";
  const desc =
    dictionaryAbout?.about?.description ||
    "Kami adalah pabrik spesialis komponen sepatu yang berfokus pada produksi hak sepatu, outsole, dan insole berkualitas. Dengan teknologi modern dan material ramah lingkungan, kami menghadirkan solusi shoes parts yang presisi, terjangkau, dan cocok untuk berbagai skala produksi — dari workshop kecil hingga pabrik besar.";

  return (
    <Container>
      <section className="py-8 md:py-12">
        {/* TOP: teks kiri, foto kanan */}
        <div className="grid gap-6 md:gap-10 md:grid-cols-[1.6fr_1fr] items-start">
          <div className="md:pr-8">
            <h1 className="text-primary font-semibold text-2xl sm:text-3xl md:text-[32px] leading-[1.3]">
              {title}
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-[20px] leading-[1.7] text-[#121212]">
              {desc}
            </p>

            {/* Foto besar di bawah paragraf (mobile-first) */}
            <div className="mt-4 md:hidden">
              <AboutPhoto
                src="/assets/images/about/about-1.webp"
                alt="Proses produksi sepatu 1"
                priority
                ratio="aspect-[4/3] md:aspect-[3/2]"
              />
            </div>
          </div>

          {/* Foto rak sepatu di kanan untuk desktop */}
          <div className="hidden md:block">
            <AboutPhoto
              src="/assets/images/about/about-1.webp"
              alt="Rak sepatu"
              priority
              ratio="aspect-[3/2]"
            />
          </div>
        </div>

        {/* BOTTOM: dua foto sejajar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AboutPhoto
            src="/assets/images/about/about-3.webp"
            alt="Proses produksi sepatu 3"
            ratio="aspect-[4/3] md:aspect-[3/2]"
          />
          <AboutPhoto
            src="/assets/images/about/about-2.webp"
            alt="Proses produksi sepatu 4"
            ratio="aspect-[4/3] md:aspect-[3/2]"
          />
        </div>
      </section>
    </Container>
  );
}
