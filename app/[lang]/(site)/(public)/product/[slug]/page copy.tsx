// app/products/pc-6601/page.tsx
"use client";
import Image from "next/image";
import { FaWhatsapp, FaRegHeart } from "react-icons/fa";
import { BiCartAdd } from "react-icons/bi";
import Container from "@/components/ui-custom/Container";
import { CiMail } from "react-icons/ci";
import { FaRegBookmark } from "react-icons/fa";
import Link from "next/link";
import ProductChoice from "./_component/ProductChoice";
import ProductPreviewClick from "./_component/ProductPreviewClick"
import ProductPreviewSlider from "./_component/ProductPreviewSlider";
import {ProductPreviewType} from "./_types/ProductPreviewType"
import { useState } from "react";
export const COLORS = ["Cream", "Hitam", "Coklat"];
// export const SIZES = ["20", "40", "60"];
// import { FaRegHeart } from "react-icons/fa";
const SIZES = [38, 39, 40, 41, 42, 43, 44, 45,46,47];
export const GRADES = ["GRADE A", "GRADE B"];
export default function ProductPC6601() {
  const [productPreviewSelection, setProductPreviewSelection] = useState<ProductPreviewType>(
    productPreviews[0]
  );
  return (
    <div>
 
    <Container className="py-[40px]">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="text-blue-600">Wishlist Saya</span> &gt; PC 6601
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Gambar */}
        <div className="flex-1 flex  flex-col items-start">
         
         {/* Gambar Produk */}
      <Image
        src={productPreviewSelection.path}
        alt={productPreviewSelection.alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto object-contain"
      />

      {/* Dot Navigation */}
      <div className="w-full flex justify-center mt-4 gap-2">
        {productPreviews.map((preview) => (
          <button
            key={preview.id}
            onClick={() => setProductPreviewSelection(preview)}
            className={`w-3 h-3 rounded-full transition-opacity duration-200`}
            style={{
              backgroundColor: "#000000",
              opacity: productPreviewSelection.id === preview.id ? 1 : 0.2,
            }}
          />
        ))}
      </div>
        </div>

        {/* Info Produk */}
        <div className="flex-1 space-y-[20px]">
          <h1 className="text-2xl font-semibold">PC 6601</h1>
          <ul className="mt-3 text-sm text-gray-700 space-y-1">
            <li>
              <b>Kategori:</b> Hak Sepatu Bening
            </li>
            <li>
              <b>Bahan:</b> Plastik Bening Berkualitas Tinggi
            </li>
            <li>
              <b>Tinggi:</b> 10cm
            </li>
            <li>
              <b>Isi Per Pack:</b> 300 Pasang
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            Terbuat dari bahan plastik bening berkualitas, hak ini memberikan
            tampilan minimalis dan elegan serta transparan yang estetik.
          </p>

          <div className="">
            <p className="text-[#D97706] text-sm">Harga Belum Termasuk Ongkir</p>
            <p className="text-3xl font-bold ">Rp 15.000  <span className="text-sm text-gray-500">Per pasang</span></p>
            
          </div>

          <ProductPreviewClick 
                  productPreviews={productPreviews} 
                  productPreviewSelection={productPreviewSelection}
                  setProductPreviewSelection={setProductPreviewSelection}>

                  </ProductPreviewClick>
          <ProductChoice
              label="Pilihan Warna"
              options={COLORS}
              onChange={(val) => console.log("Warna dipilih:", val)}
            />

          <ProductChoice
              label="Pilihan Bahan"
              options={GRADES}
              onChange={(val) => console.log("Warna dipilih:", val)}
            />

          <ProductChoice
              label="Ukuran tersedia"
              options={SIZES}
              onChange={(val) => console.log("Warna dipilih:", val)}
            />
        

          {/* Tombol */}
          <div className="flex flex-col lg:flex-row gap-3 mt-6">
            <div className="flex w-full lg:w-auto gap-3 ">

        
              <button className="w-1/2 lg:w-auto flex  justify-center items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-[8px]">
                <FaWhatsapp size={28} /> 
              </button>
              <button className="w-1/2 lg:w-auto  flex  justify-center  items-center gap-2 bg-primary text-white px-4 py-2 rounded-[8px]">
                <CiMail size={28} /> 
              </button>

            </div>
            <button className="w-full lg:w-auto flex  justify-center items-center gap-2 border border-primary px-4 py-2 rounded-[8px] text-primary">
              < FaRegHeart size={28} />Tambahkan Ke Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Rekomendasi Produk */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 text-blue-700">
          Anda mungkin juga menyukainya
        </h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {productRelevan
                
                .map((product) => (
               
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`} // arahkan ke slug
                    className="bg-white   flex flex-col   hover:shadow-md transition"
                  >
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain"
                      />
                      <div className="p-2 space-y-[4px]">
                          <h4 className=" font-semibold text-[#121212] font-[24px] leading-[130%]" >
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.code}</p>
                        <p className=" ">
                          <span className="font-semibold text-[#121212] font-[24px] leading-[130%]"> Rp {product.price.toLocaleString("id-ID")} /</span>
                           <span className=" text-[#121212] font-[20px] leading-[130%]">pasang</span>
                        </p>
                      </div>
                   
                  </Link>
                ))}
            </div>
     
      </div>
      
    </Container>
    </div>
  );
}


const productPreviews:ProductPreviewType[] = [

  {
    "id": 1,
    "title": "Timbangan Pegas Gantung Comanche Made In Vietnam Kapasitas 200 Kg",
    "alt": "biasanya digunakan untuk menimbang barang pecah belah",
    "path": "/assets/demo/demo-product.png"
  },
  {
    "id": 2,
    "title": "Timbangan Pegas Gantung Comanche Made In Vietnam Kapasitas 200 Kg",
    "alt": "biasanya digunakan untuk menimbang barang pecah belah",
    "path": "/assets/demo/demo-product2.webp"
  },
 
 
];


const productRelevan = [
  {
    id: 1,
    name: "Hak Sepatu Bening",
    code: "PC6601",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "hak-sepatu-bening",
  },
  {
    id: 2,
    name: "Outsole Siap Pakai",
    code: "OS 2188",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "outsole-siap-pakai",
  },
  {
    id: 3,
    name: "Wedges",
    code: "WS 9089",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "wedges",
  },
  {
    id: 4,
    name: "Insole",
    code: "IS 1919",
    price: 8000,
    image: "/assets/demo/demo-product.png",
    slug: "insole",
  },
];