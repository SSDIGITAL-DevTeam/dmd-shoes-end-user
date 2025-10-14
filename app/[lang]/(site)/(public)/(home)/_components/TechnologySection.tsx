"use client";

import React from "react";
import Image from "next/image";
import {
  FaCog,
  FaRecycle,
  FaBullseye,
  FaMoneyBillWave,
  FaLayerGroup,
} from "react-icons/fa";
import Container from "@/components/ui-custom/Container";
import { HiArrowRight } from "react-icons/hi";
import Link from "next/link";
import { Inter } from "next/font/google";
import clsx from "clsx";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function TechnologySection({
  lang,
  dict,
  className,
}: {
  lang: string;
  dict: any;
  className?: string;
}) {
  const features = [
    {
      icon: <FaCog size={20} />,
      title: dict?.technology?.features?.fastProduction?.title,
      description: dict?.technology?.features?.fastProduction?.description,
    },
    {
      icon: <FaRecycle size={20} />,
      title: dict?.technology?.features?.recycledMaterial?.title,
      description: dict?.technology?.features?.recycledMaterial?.description,
    },
    {
      icon: <FaBullseye size={20} />,
      title: dict?.technology?.features?.precisionConsistency?.title,
      description: dict?.technology?.features?.precisionConsistency?.description,
    },
    {
      icon: <FaMoneyBillWave size={20} />,
      title: dict?.technology?.features?.costEfficiency?.title,
      description: dict?.technology?.features?.costEfficiency?.description,
    },
    {
      icon: <FaLayerGroup size={20} />,
      title: dict?.technology?.features?.scalability?.title,
      description: dict?.technology?.features?.scalability?.description,
    },
  ];

  return (
    // ganti root jadi <section> & tanpa py default
    <section className={clsx(inter.className, className)}>
      <Container>
        <div className="flex flex-col items-center gap-8 md:flex-row lg:gap-12">
          {/* Left: Text & Features */}
          <div className="w-full md:w-1/2">
            <h2 className="mb-6 text-xl font-semibold leading-tight text-primary md:text-2xl">
              {dict?.technology?.heading}
            </h2>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded bg-primary p-2 text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#000000] md:text-[15px]">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 md:text-[15px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${lang}/product`}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 md:px-5 md:py-2.5 md:text-[15px]"
            >
              {dict?.technology?.button} <HiArrowRight size={18} />
            </Link>
          </div>

          {/* Right: Image */}
          <div className="flex w-full justify-center md:w-1/2">
            <div className="relative aspect-video w-full max-w-[600px] overflow-hidden">
              <Image
                src="/assets/images/home/teknologi-unggulan.webp"
                alt={dict?.technology?.imageAlt || ""}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 600px, 90vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
