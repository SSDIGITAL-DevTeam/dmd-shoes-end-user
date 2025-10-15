// FeaturesSection.tsx (tetap Server Component, jangan "use client")
import React from "react";
import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import { getDictionaryAbout } from "../../../../../../dictionaries/about/get-dictionary-about";

type LocalIcon = "quality" | "choices" | "price" | "service";

// path absolut ke /public
const ICONS: Record<LocalIcon, string> = {
  quality: "/assets/svg/about/quality.svg",
  choices: "/assets/svg/about/choices.svg",
  price: "/assets/svg/about/price.svg",
  service: "/assets/svg/about/service.svg",
};

function FeatureIcon({ name }: { name: LocalIcon }) {
  return (
    // no bg, no rounded — biar pakai badge dari SVG-nya saja
    <img
      src={ICONS[name]}
      alt={`${name} icon`}
      width={28}
      height={28}
      className="w-7 h-7 inline-block"
    />
  );
}

function FeatureItem({ icon, title, description }: { icon: LocalIcon; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <FeatureIcon name={icon} />
      <div>
        <h4 className="text-lg font-semibold text-black leading-snug">{title}</h4>
        <p className="mt-1 text-[17px] leading-relaxed text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection({
  lang, dictionaryAbout,
}: {
  lang: string;
  dictionaryAbout: Awaited<ReturnType<typeof getDictionaryAbout>>;
}) {
  const t = dictionaryAbout?.whyChooseUs;

  const features = [
    { icon: "quality" as const, title: t?.quality?.title ?? "Kualitas Terjamin", description: t?.quality?.description ?? "Setiap produk kami melewati proses seleksi ketat." },
    { icon: "choices" as const, title: t?.choices?.title ?? "Pilihan Lengkap", description: t?.choices?.description ?? "Dari sneakers, loafers, hingga sandal, semua ada di sini." },
    { icon: "price" as const, title: t?.price?.title ?? "Harga Bersahabat", description: t?.price?.description ?? "Kualitas tinggi dengan harga tetap kompetitif." },
    { icon: "service" as const, title: t?.service?.title ?? "Layanan Ramah & Cepat", description: t?.service?.description ?? "Tim kami siap membantu menemukan solusi terbaik." },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-[78px]">
      <Container>
        {/* Mobile: teks dulu, gambar di bawah; Desktop: gambar kiri */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* === VISUAL KIRI (desktop kiri, mobile di bawah) === */}
          <div className="order-2 md:order-1 justify-self-center md:justify-self-start w-full md:w-auto">
            <div className="relative">
              {/* Image intrinsic: tidak pakai fill/cover */}
              <Image
                src="/assets/images/about/about-4.webp"
                alt="Proses pembuatan"
                width={1600}   // isi kira-kira rasio aslinya; boleh 1200x800, 1500x900, dsb.
                height={1000}
                priority
                className="w-full h-auto block"
                sizes="(max-width: 768px) 88vw, (max-width: 1200px) 560px, 600px"
              />
            </div>
          </div>

          {/* Teks + fitur: order-1 di mobile, order-2 di desktop */}
          <div className="order-1 md:order-2">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              {t?.title ?? "MENGAPA MEMILIH KAMI"}
            </h2>
            <h3 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold leading-tight mb-6">
              {t?.subtitle ?? "Karena Kaki Anda Layak yang Terbaik"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {features.map((f) => <FeatureItem key={f.icon} {...f} />)}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
