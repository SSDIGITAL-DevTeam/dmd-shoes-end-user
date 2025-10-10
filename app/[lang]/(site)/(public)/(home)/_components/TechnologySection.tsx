// components/TechnologySection.tsx
import React from "react"
import Image from "next/image"
import {
  FaCog,
  FaRecycle,
  FaBullseye,
  FaMoneyBillWave,
  FaLayerGroup,
} from "react-icons/fa"
import Container from "@/components/ui-custom/Container"
import { HiArrowRight } from "react-icons/hi"
import Link from "next/link"
import { Inter } from "next/font/google"

// ✅ Import font Inter hanya untuk halaman ini
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function TechnologySection({ lang, dict }: { lang: string; dict: any }) {
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
  ]

  return (
    <div className={`py-12 ${inter.className}`}>
      <Container>
        <div className="flex flex-col items-center gap-8 md:flex-row lg:gap-12">
          {/* Left Section: Text & Features */}
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

            {/* Button */}
            <Link
              href={`/${lang}/product`}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 md:px-5 md:py-2.5 md:text-[15px]"
            >
              {dict?.technology?.button} <HiArrowRight size={18} />
            </Link>
          </div>

          {/* Right Section: Image */}
          <div className="flex w-full justify-center md:w-1/2">
            <Image
              src="/assets/images/home/teknologi-unggulan.webp"
              alt={dict?.technology?.imageAlt || ""}
              width={600}
              height={400}
              className="object-cover "
            />
          </div>
        </div>
      </Container>
    </div>
  )
}
