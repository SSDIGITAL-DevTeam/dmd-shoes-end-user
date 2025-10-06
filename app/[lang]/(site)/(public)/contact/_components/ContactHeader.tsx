// app/components/ContactHeader.js
import Image from "next/image";
import { Inter } from "next/font/google"; // load font Inter dari Google Fonts

// inisialisasi font Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"], // pilih bobot font yang kamu butuhkan
});

export default function ContactHeader({ dictionaryContact }: { dictionaryContact: any }) {
  return (
    <div className="relative w-full">
      <Image
        src="/assets/images/contact/contact-header.webp"
        alt="Contact Header"
        width={1200}
        height={400}
        className="w-full h-auto"
        priority
      />
      <h1
        className={`${inter.className} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-[24px] lg:text-[80px] leading-[100px] m-0`}
      >
        {dictionaryContact?.title || "Contact"}
      </h1>
    </div>
  );
}
