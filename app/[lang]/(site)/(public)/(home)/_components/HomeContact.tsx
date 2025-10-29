import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { inter } from "@/config/font";

type HomeContactProps = {
  lang: string;
  dict: any;
  className?: string;
};

const containerClass = "mx-auto w-full max-w-[1200px] px-4 md:px-6";

export default function HomeContact({ lang, dict, className }: HomeContactProps) {
  return (
    <section
      className={clsx(
        "bg-[#F5F5F5] pt-10 pb-16 sm:pt-14 sm:pb-18 md:pt-18 md:pb-18",
        inter.className,
        className,
      )}
    >
      <div className={containerClass}>
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2">
          <div className="flex justify-center">
            <div className="relative aspect-video w-full max-w-[420px] overflow-hidden rounded-lg">
              <Image
                src="/assets/images/home/home-contact.webp"
                alt="Sepatu"
                fill
                className="object-contain"
                priority={false}
                loading="lazy"
                sizes="(min-width: 768px) 420px, 90vw"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="mb-2 text-xl font-semibold leading-snug text-gray-900 md:text-2xl">
              {dict?.contact?.heading}
            </h2>
            <p className="mb-4 text-sm text-gray-600 md:text-base">
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
      </div>
    </section>
  );
}
