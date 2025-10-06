"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import Container from "@/components/ui-custom/Container";
import { CONTACT, formatWhatsapp } from "@/config/contact";
import Link from "next/link";
interface Product {
  id: number;
  name: string;
  code: string;
  material: string;
  color: string;
  size: number;
  price: number;
  image: string;
  checked: boolean;
}

const Wishlist = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Outsole Siap Pakai",
      code: "OS 2172",
      material: "Grade A",
      color: "Hitam",
      size: 37,
      price: 8000,
      image: "/assets/demo/demo-product.png",
      checked: true,
    },
    {
      id: 2,
      name: "Outsole Siap Pakai",
      code: "OS 2172",
      material: "Grade A",
      color: "Hitam",
      size: 37,
      price: 8000,
      image: "/assets/demo/demo-product.png",
      checked: true,
    },
    {
      id: 3,
      name: "Outsole Siap Pakai",
      code: "OS 2172",
      material: "Grade A",
      color: "Hitam",
      size: 37,
      price: 8000,
      image: "/assets/demo/demo-product.png",
      checked: true,
    },
    {
      id: 4,
      name: "Outsole Siap Pakai",
      code: "OS 2172",
      material: "Grade A",
      color: "Hitam",
      size: 37,
      price: 8000,
      image: "/assets/demo/demo-product.png",
      checked: false,
    },
  ]);

  const toggleCheck = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setProducts((prev) => prev.map((p) => ({ ...p, checked })));
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const selectedCount = products.filter((p) => p.checked).length;
  const message = `Hi, DMD Shoes. Saya tertarik dengan produk :
  OS 2138 (Grade A, cream, 40)
  WS 9089 (Grade A, 40)
  OS 2138 (Grade B, cream, 40)`
  return (
    <Container className="py-8">
      <h1 className="font-inter font-semibold text-[32px] leading-[150%] text-primary">
        Favorit Saya{" "}
        <span className="text-[#121212]/50 text-[24px] font-normal">
          (4 Produk)
        </span>
      </h1>

      <div className="mt-[20px] flex flex-col lg:flex-row gap-6  font-sans items-start">
        {/* Kiri: Daftar Produk */}
        <div className="flex-1 bg-white border border-[#EEEEEE] rounded-[16px]  ">
          <h2 className="font-semibold text-lg p-[24px]">Produk Di Favorit Saya</h2>

          {/* Pilih Semua */}
          <div className="flex items-center gap-2 px-[24px] py-[10px]">
            <input
              type="checkbox"
              checked={products.every((p) => p.checked)}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[#121212] font-semibold leading[-150%] font-[26px] font-[inter]">
              Pilih Semua
            </span>
          </div>

          {/* Daftar Produk */}
          <div className="bg-[#F5F5F5]">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center  py-[10px] px-[32px]  space-x-[16px] "
              >
                <input
                  type="checkbox"
                  checked={product.checked}
                  onChange={() => toggleCheck(product.id)}
                  className="mt-2 w-4 h-4 accent-primary"
                />
                <div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="object-contain border rounded"
                  />
                </div>
                <div className="flex-1 ">
                  <p className="font-[24px] font-semibold font-inter leading-[150%]">
                    {product.name}
                  </p>
                  <p className="font-inter text-primary font-[22px] leading-[150%]">
                    {product.code}
                  </p>
                  <p className="font-inter text-[#121212] font-[22px]  leading-[150%]">
                    Pilihan Bahan : {product.material}
                  </p>
                  <p className="font-inter text-[#121212] font-[22px]  leading-[150%]">
                    Pilihan Warna : {product.color}
                  </p>
                  <p className="font-inter text-[#121212] font-[22px]  leading-[150%]">
                    Ukuran : {product.size}
                  </p>
                </div>
                <div className="flex   items-center gap-2 space-x-[24px]">
                  <span className="font-semibold text-sm">
                    {product.price.toLocaleString("id-ID")} / pasang
                  </span>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="bg-red-600 text-white px-[12px] py-[8px] hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan: Summary */}
        <div className="w-full h-auto  lg:w-124 bg-white border border-[#EEEEEE] rounded-[16px] p-[24px]   ">
          <p className="font-medium ">{selectedCount} Produk Dipilih</p>
          <Link
            href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
              message
            )}`}
            className="mt-[40px] flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
          >
            <FaWhatsapp />
            Pesan Melalui WhatsApp Sekarang
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Wishlist;
