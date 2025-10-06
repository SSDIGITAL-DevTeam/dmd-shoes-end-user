// components/CategorySection.tsx
import React from "react"
import Image from "next/image"
import Link from "next/link"
import Container from "@/components/ui-custom/Container"
import { Inter, Assistant } from "next/font/google"

// ✅ Import font Inter (default)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

// ✅ Import font Assistant (khusus tombol "More")
const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const categories = [
  {
    title: "Shoe Heels",
    image: "/assets/demo/product-category-demo.webp",
    link: "/categories/shoe-heels",
    linkText: "Hak Sepatu",
  },
  {
    title: "Clear Heels",
    image: "/assets/demo/product-category-demo.webp",
    link: "/categories/clear-heels",
    linkText: "Hak Sepatu Bening",
  },
  {
    title: "Outsole",
    image: "/assets/demo/product-category-demo.webp",
    link: "/categories/outsole",
    linkText: "Outsole",
  },
  {
    title: "Wedges",
    image: "/assets/demo/product-category-demo.webp",
    link: "/categories/wedges",
    linkText: "Wedges",
  },
]

export default function CategorySection({ lang, dict }: { lang: string; dict: any }) {
  return (
    <div className={`py-[60px] ${inter.className}`}>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {categories.map((cat, index) => (
            <Link
              href={`/${lang}/product`}
              key={index}
              className="flex flex-col"
            >
              {/* Image */}
              <div className="w-full">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>

              <div className="w-full mt-8">
                {/* Title */}
                <h2 className="mt-4 font-semibold text-[18px] uppercase tracking-wide">
                  {cat.title}
                </h2>

                {/* More Button → khusus pakai font Assistant */}
                <div>
                  <button
                    className={`mt-2 inline-block bg-primary text-white px-4 py-2 text-[14px] rounded-[40px] hover:bg-primary/90 transition ${assistant.className}`}
                  >
                    {dict?.category?.more} &gt;
                  </button>
                </div>

                {/* Bottom link text */}
                <div>
                  <button className="mt-4 text-sm text-gray-600 hover:text-primary transition">
                    {cat.linkText} &rarr;
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
