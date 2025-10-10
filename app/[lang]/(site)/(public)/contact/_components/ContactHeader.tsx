// app/components/ContactHeader.tsx
"use client";

import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"], // 600 = Semi Bold
  variable: "--font-inter",
});

export default function ContactHeader({
  dictionaryContact,
}: {
  dictionaryContact: any;
}) {
  const title = dictionaryContact?.title || "Contact Us";

  return (
    <header className="relative w-full overflow-hidden">
      {/* Wrapper dengan tinggi konsisten seperti hero */}
      <div className="relative h-[45vh] md:h-[55vh] lg:h-[60vh] max-h-[520px]">
        {/* Background image (cover) */}
        <Image
          src="/assets/images/contact/contact-header.webp"
          alt="Contact Header"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Overlay gelap + gradient kiri→kanan (seperti hero) */}
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0
                     bg-gradient-to-r from-black/65 via-black/40 to-transparent"
          aria-hidden
        />

        {/* Text block (center) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <h1
            className={`${inter.className} font-semibold text-white
                text-center px-4
                text-4xl md:text-5xl lg:text-[48px]
                leading-tight md:leading-[1.12] lg:leading-[1.08]
                tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]`}
          >
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
