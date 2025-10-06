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
      icon: <FaCog size={22} />,
      title: dict?.technology?.features?.fastProduction?.title,
      description: dict?.technology?.features?.fastProduction?.description,
    },
    {
      icon: <FaRecycle size={22} />,
      title: dict?.technology?.features?.recycledMaterial?.title,
      description: dict?.technology?.features?.recycledMaterial?.description,
    },
    {
      icon: <FaBullseye size={22} />,
      title: dict?.technology?.features?.precisionConsistency?.title,
      description: dict?.technology?.features?.precisionConsistency?.description,
    },
    {
      icon: <FaMoneyBillWave size={22} />,
      title: dict?.technology?.features?.costEfficiency?.title,
      description: dict?.technology?.features?.costEfficiency?.description,
    },
    {
      icon: <FaLayerGroup size={22} />,
      title: dict?.technology?.features?.scalability?.title,
      description: dict?.technology?.features?.scalability?.description,
    },
  ]

  return (
    <div className={`py-[78px] ${inter.className}`}>
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          {/* Left Section: Text & Features */}
          <div className="w-full md:w-1/2">
            <h2 className="text-[32px] font-bold leading-[130%] text-primary mb-8">
              {dict?.technology?.heading}
            </h2>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary text-white p-2 rounded">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[18px] leading-[150%] text-[#000000]">
                      {feature.title}
                    </h3>
                    <p className="font-normal text-[16px] leading-[150%] text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}
            <Link
              href={`/${lang}/product`}
              className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition"
            >
              {dict?.technology?.button} <HiArrowRight size={20} />
            </Link>
          </div>

          {/* Right Section: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
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
