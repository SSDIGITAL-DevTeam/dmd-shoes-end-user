"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import Container from "@/components/ui-custom/Container";
import { CONTACT } from "@/config/contact";
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
OS 2138 (Grade B, cream, 40)`;

  return (
    <Container className="py-8">
      <h1 className="font-inter font-semibold text-[32px] leading-[150%] text-primary">
        Favorit Saya{" "}
        <span className="text-[#121212]/50 text-[24px] font-normal">
          ({products.length} Produk)
        </span>
      </h1>

      <div className="mt-[20px] flex flex-col lg:flex-row gap-6 font-sans items-start">
        {/* Kiri: Daftar Produk */}
        <div className="w-full lg:w-auto lg:flex-1 bg-white border border-[#EEEEEE] rounded-[16px]">
          <h2 className="font-semibold text-lg p-[24px]">
            Produk Di Favorit Saya
          </h2>

          {/* Pilih Semua */}
          <div className="flex items-center gap-2 px-[24px] py-[10px]">
            <input
              type="checkbox"
              checked={products.every((p) => p.checked)}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-[#121212] font-semibold text-[20px] lg:text-[22px] font-inter">
              Pilih Semua
            </span>
          </div>

          {/* Daftar Produk */}
          <div className="bg-[#F5F5F5]">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center py-[10px] px-[32px] space-x-[16px]"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={product.checked}
                  onChange={() => toggleCheck(product.id)}
                  className="mt-2 w-4 h-4 accent-primary"
                />

                {/* Gambar */}
                <div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={70}
                    height={70}
                    className="w-[70px] h-[70px] lg:w-[60px] lg:h-[60px] object-contain border rounded"
                  />
                </div>

                {/* Detail + Harga */}
                <div className="flex flex-1 flex-col lg:flex-row justify-between">
                  {/* Kiri: Detail produk */}
                  <div className="flex-1">
                    <p className="text-[20px] lg:text-[24px] font-semibold font-inter leading-[150%]">
                      {product.name}
                    </p>
                    <p className="font-inter text-primary text-[18px] lg:text-[22px] leading-[150%]">
                      {product.code}
                    </p>
                    <p className="font-inter text-[#121212] text-[18px] lg:text-[22px] leading-[150%]">
                      Pilihan Bahan : {product.material}
                    </p>
                    <p className="font-inter text-[#121212] text-[18px] lg:text-[22px] leading-[150%]">
                      Pilihan Warna : {product.color}
                    </p>
                    <p className="font-inter text-[#121212] text-[18px] lg:text-[22px] leading-[150%]">
                      Ukuran : {product.size}
                    </p>
                  </div>

                  {/* Kanan: Harga + Tombol */}
                  <div className="flex items-center justify-between lg:justify-end gap-2 lg:space-x-[24px] mt-3 lg:mt-0">
                    <span className="font-semibold text-sm lg:text-base">
                      {product.price.toLocaleString("id-ID")} / pasang
                    </span>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="bg-red-600 text-white px-[12px] py-[8px] hover:bg-red-800 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan: Summary */}
        <div className="w-full h-auto lg:w-124 bg-white border border-[#EEEEEE] rounded-[16px] p-[24px]">
          <p className="font-medium">{selectedCount} Produk Dipilih</p>
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
