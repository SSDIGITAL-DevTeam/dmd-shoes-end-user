// components/FeaturesSection.js
import React from "react"
import Image from "next/image"
import {
  AiOutlineStar,
  AiOutlineShoppingCart,
  AiOutlineDollarCircle,
  AiOutlinePhone,
} from "react-icons/ai"
import Container from "@/components/ui-custom/Container"
// import { HiArrowRight } from "react-icons/hi"
import { getDictionaryAbout } from '../../../../../../dictionaries/about/get-dictionary-about';





export default function FeaturesSection({ lang,dictionaryAbout }: { lang: string,dictionaryAbout:Awaited<ReturnType<typeof getDictionaryAbout>> }) {


  const features = [
    {
      icon: <AiOutlineStar size={28} />,
      title:dictionaryAbout?.whyChooseUs?.quality.title || "Kualitas Terjamin",
      description:dictionaryAbout?.whyChooseUs?.quality.description || "Setiap produk kami melewati proses seleksi ketat.",
      
    },
    {
      icon: <AiOutlineShoppingCart size={28} />,
      title: dictionaryAbout?.whyChooseUs?.choices.title || "Pilihan Lengkap",
      description:dictionaryAbout?.whyChooseUs?.choices.description || "Dari sneakers, loafers, hingga sandal santai, semua ada di sini.",
  
    },
    {
      icon: <AiOutlineDollarCircle size={28} />,
     // title: "Harga Bersahabat",
      title: dictionaryAbout?.whyChooseUs?.price.title || "Harga Bersahabat",
      description: dictionaryAbout?.whyChooseUs?.price.description ||"Produk berkualitas dengan harga yang tetap ramah di dompet.",
    },
    {
      icon: <AiOutlinePhone size={28} />,
      title:  dictionaryAbout?.whyChooseUs?.service.title || "Layanan Ramah & Cepat",
      description:  dictionaryAbout?.whyChooseUs?.price.title ||  "Tim kami selalu siap membantu memilihkan yang terbaik untuk Anda.",
    },
  ]
  
  return (
    <>
    <div className="py-[78px]">


        <Container>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-24 relative">
            {/* Left Section: Image */}
            <div className="relative w-full md:w-1/3 flex justify-center md:justify-start">
              <div className="relative w-[300px] h-[400px] lg:w-[400px] lg:h-[500px]">
                <Image
                  src="/assets/demo/demo-product.png"
                  alt="Kaki di kursi kuning memakai sepatu bot"
                  fill
                  className="object-cover z-10"
                />
                {/* Blue background element */}
                <div className="absolute top-8 left-8 w-full h-full bg-primary z-0"></div>
              </div>
            </div>

            {/* Right Section: Features */}
            <div className="w-full md:w-2/3">
              <h2 className="text-[20px] font-semibold text-primary uppercase mb-1">
                
                    {dictionaryAbout?.whyChooseUs?.title ||"MENGAPA MEMILIH KAMI"}
                
                
              </h2>
              <h3 className="text-[40px] font-bold text-[#000000] leading-[150%] mb-8">
                {dictionaryAbout?.whyChooseUs?.subtitle ||"Karena Kaki Anda Layak yang Terbaik"}
                
              </h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary text-white p-2 rounded">
                      <div className="w-[20px] h-[20px] flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[20px] leading-[150%] text-[#000000]">
                        {feature.title}
                      </h4>
                      <p className="font-normal text-[20px] leading-[150%] text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>

            
    </div>

    </>
  )
}


