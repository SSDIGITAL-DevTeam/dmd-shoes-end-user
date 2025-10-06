import React from "react";
import { Inter } from "next/font/google";
import Container from "@/components/ui-custom/Container";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ArticleSlider from "../_components/ArticleSlider";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

function ArtikelPost() {
  

  return (
    <div className={` ${inter.className} bg-white min-h-screen`}>
      {/* Header Artikel */}

      {/* Konten Utama Artikel */}
      <div
      className={`
        mx-auto w-full px-4
        max-w-2xl sm:max-w-3xl md:max-w-4x
        py-[38px]
      
      `}
     
    >
      
        {/* Baris pertama */}
        <div className="flex items-center mb-4">
          <a
            href="/artikel"
            className="text-[20px] leading-[120%] font-medium text-primary flex items-center gap-2"
          >
            Artikel
          </a>
          <span className="mx-2 text-[20px] leading-[120%] font-medium text-[#9E9E9E] flex">
            <FaChevronRight className="text-[18px]" /> Cara Memilih Sepatu Yang
            Cocok Dengan Vibes Kamu
          </span>
        </div>

        {/* Baris kedua - Heading */}
        <h1 className="text-[36px] leading-[150%] font-bold text-primary mb-3">
          Cara Memilih Sepatu Yang Cocok Dengan Vibes Kamu
        </h1>

        {/* Baris ketiga */}
        <p className="text-[18px] leading-[24px] text-[#003663]">
          Admin - 28 April 2025
        </p>
        <div className="bg-white p-6 md:p-2 ">
          <div className="relative w-full h-[400px]  overflow-hidden mb-8">
            <Image
              src="/assets/demo/article/article-item.webp"
              alt="Sepatu Sneakers"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="prose max-w-none text-gray-700">
            <p className="mb-6">
              Memilih sepatu yang tepat adalah investasi penting untuk kesehatan
              kaki dan penampilan. Salah pilih sepatu bisa menyebabkan lecet,
              pegal, bahkan cedera postur. Itulah mengapa penting untuk meninjau
              berbagai fungsinya, kenyamanan, dan reputasi sebelum membeli.
            </p>
            <p className="mb-6">
              Berikut adalah panduan lengkap memilih sepatu yang cocok untuk
              berbagai kebutuhan:
            </p>

            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <h2 className="text-xl font-bold mb-2">
                  Perhatikan Kebutuhan Pemakaian
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">
                      Untuk Kasual / Jalan Santai:
                    </span>{" "}
                    Pilih sepatu berbahan ringan dan breathable seperti kanvas,
                    mesh. Model slip-on atau sneakers low-cut cocok untuk
                    kenyamanan harian.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Untuk Olahraga / Formal:
                    </span>{" "}
                    Gunakan sepatu bermotif kulit asli atau sintetis yang
                    disesuaikan dengan acara formal atau bisnis. Pilihan seperti
                    sneakers atau oxford shoes klasik bisa jadi pilihan tepat.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Untuk Aktivitas Outdoor:
                    </span>{" "}
                    Pilih sepatu dengan sol anti-slip dan bahan tahan air agar
                    tidak mudah licin atau basah.
                  </li>
                </ul>
              </li>
              <li>
                <h2 className="text-xl font-bold mb-2">
                  Pilih Ukuran yang Tepat
                </h2>
                <p>
                  Ukuran sepatu yang salah bisa menimbulkan banyak masalah.
                  Pastikan ada jarak sekitar 1 cm di ujung sepatu untuk
                  menghindari tekanan berlebih pada jari kaki.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Ukur kaki pada sore hari, karena kaki cenderung mengembang
                    di siang hari.
                  </li>
                  <li>Coba dua sepatu sekaligus dan rasakan perbedaannya.</li>
                  <li>
                    Pastikan ukuran sepatu yang dipilih benar-benar nyaman dan
                    tidak terlalu ketat.
                  </li>
                </ul>
              </li>
              <li>
                <h2 className="text-xl font-bold mb-2">
                  Utamakan Kualitas & Daya Tahan
                </h2>
                <p>
                  Sepatu berkualitas memang penting, sebab lebih mahal, tapi
                  biasanya masa pakainya lebih lama dan nyaman dipakai dalam
                  jangka panjang.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Periksa kualitas jahitan dan perekat yang kuat.</li>
                  <li>
                    Pilih bahan yang breathable agar kaki tidak mudah bau dan
                    tidak berkeringat berlebihan.
                  </li>
                  <li>Bandingkan review kualitas dari pembeli.</li>
                </ul>
              </li>
            </ol>

            <div className="mt-8 border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-bold mb-2">Tips Tambahan:</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Gunakan insole tambahan untuk meningkatkan kenyamanan jika
                  diperlukan.
                </li>
                <li>
                  Simpan sepatu di tempat yang sejuk dan kering agar tidak cepat
                  rusak.
                </li>
                <li>
                  Bersihkan sepatu secara rutin untuk menjaga kualitasnya.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Artikel Lainnya */}
        <div className="py-8">
          <h2 className="text-xl font-bold mb-4">Artikel Lainnya :</h2>
          <ArticleSlider></ArticleSlider>
        </div>
        </div>
    </div>
  );
}

export default ArtikelPost;
