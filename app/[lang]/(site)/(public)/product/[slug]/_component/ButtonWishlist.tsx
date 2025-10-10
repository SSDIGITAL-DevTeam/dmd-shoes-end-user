"use client";

import React from "react";
import { FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ButtonWishlistProps = {
  labels?: {
    add?: string;
    loading?: string;
    modalTitle?: string;
    login?: string;
    register?: string;
  };
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isLoginPromptOpen?: boolean;
  onCloseLoginPrompt?: () => void;
  loginHref: string;
  registerHref: string;
};

export default function ButtonWishlist({
  labels,
  onClick,
  disabled = false,
  isLoading = false,
  isLoginPromptOpen = false,
  onCloseLoginPrompt,
  loginHref,
  registerHref,
}: ButtonWishlistProps) {
  const addLabel = labels?.add ?? "Tambahkan ke Favorit";
  const loadingLabel = labels?.loading ?? "Menambahkan...";
  const modalTitle =
    labels?.modalTitle ?? "Masuk untuk menambahkan produk ke favorit";
  const loginLabel = labels?.login ?? "Masuk";
  const registerLabel = labels?.register ?? "Daftar";

  const handleClose = () => {
    onCloseLoginPrompt?.();
  };

  return (
    <div className={plusJakartaSans.className}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={clsx(
          "flex w-full items-center justify-center gap-2 rounded-[8px] border border-primary px-4 py-2 text-primary transition hover:bg-primary/5 lg:w-auto",
          (disabled || isLoading) && "cursor-not-allowed opacity-70",
        )}
      >
        <FaRegHeart size={24} aria-hidden="true" />
        {isLoading ? loadingLabel : addLabel}
      </button>

      {isLoginPromptOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md space-y-8 rounded-lg bg-white p-6 text-center shadow-lg"
          >
            <button
              onClick={handleClose}
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
                href={loginHref}
                className="w-full rounded-[8px] bg-primary py-2 text-[18px] font-medium leading-[150%] text-white"
              >
                {loginLabel}
              </Link>
              <Link
                href={registerHref}
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
