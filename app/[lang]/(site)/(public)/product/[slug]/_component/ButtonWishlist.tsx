"use client";

import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from 'next/link'
 
// Import font
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // pilih sesuai kebutuhan
});

function ButtonWishlist() {
  const [open, setOpen] = useState(false);

  return (
    <div className={plusJakartaSans.className}>
      {/* Tombol Wishlist */}
      <button
        onClick={() => setOpen(true)}
        className="w-full lg:w-auto flex justify-center items-center gap-2 border border-primary px-4 py-2 rounded-[8px] text-primary"
      >
        <FaRegHeart size={28} />
        Tambahkan Ke Favorit
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)} // klik background close
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
        >
          <div
            onClick={(e) => e.stopPropagation()} // cegah close kalau klik isi modal
            className={`bg-white rounded-lg 
                        shadow-lg w-[90%] 
                        max-w-md p-6 
                        text-center relative
                        space-y-[32px]
                        `}
          >
            {/* Tombol close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Text */}
            <h2 className="text-primary text-[28px] font-semibold leading-[150%] ">
              Masuk untuk menambahkan produk ke Favorit
            </h2>

            {/* Gambar ilustrasi */}
            <div className="flex justify-center ">
              <Image
                src="/assets/images/product/product-favorit-login.svg"
                alt="Login Illustration"
                width={250}
                height={200}
              />
            </div>

            {/* Tombol Masuk & Daftar */}
            <div className="flex flex-col gap-3 ">
                <Link href="/auth/login" 
                    className={`w-full py-2 
                                bg-primary 
                                text-white 
                                font-medium
                                text-[20px]
                                leading-[150%]
                                `}>
                    Masuk
                </Link>
                <Link href="/auth/register" 
                    className={`w-full py-2 
                                border border-primary
                                text-primary font-medium`}>
                    Daftar
                </Link>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ButtonWishlist;
