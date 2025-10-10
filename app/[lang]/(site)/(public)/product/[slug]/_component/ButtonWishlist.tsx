"use client";

import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ButtonWishlistProps = {
  labels?: {
    add?: string;
    modalTitle?: string;
    login?: string;
    register?: string;
  };
};

export default function ButtonWishlist({ labels }: ButtonWishlistProps) {
  const [open, setOpen] = useState(false);

  const addLabel = labels?.add ?? "Tambahkan ke Favorit";
  const modalTitle =
    labels?.modalTitle ?? "Masuk untuk menambahkan produk ke Favorit";
  const loginLabel = labels?.login ?? "Masuk";
  const registerLabel = labels?.register ?? "Daftar";

  return (
    <div className={plusJakartaSans.className}>
      <button
        onClick={() => setOpen(true)}
        className="w-full lg:w-auto flex justify-center items-center gap-2 border border-primary px-4 py-2 rounded-[8px] text-primary"
      >
        <FaRegHeart size={24} aria-hidden="true" />
        {addLabel}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md space-y-8 rounded-lg bg-white p-6 text-center shadow-lg"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-2xl text-gray-500 hover:text-gray-800"
              aria-label="Close"
              type="button"
            >
              ×
            </button>

            <h2 className="text-[24px] font-semibold leading-[150%] text-primary">
              {modalTitle}
            </h2>

            <div className="flex justify-center">
              <Image
                src="/assets/images/product/product-favorit-login.svg"
                alt="Wishlist illustration"
                width={240}
                height={180}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="w-full rounded-[8px] bg-primary py-2 text-[18px] font-medium leading-[150%] text-white"
              >
                {loginLabel}
              </Link>
              <Link
                href="/auth/register"
                className="w-full rounded-[8px] border border-primary py-2 text-[18px] font-medium leading-[150%] text-primary"
              >
                {registerLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
