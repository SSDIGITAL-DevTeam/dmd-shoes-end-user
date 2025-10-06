import React from "react";
import { inter,lato } from "@/config/font";

function Pagination({ align = "center" }) {
  // Mapping align ke tailwind
  const alignClass =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div
      className={`${lato.className}  flex ${alignClass} items-center gap-3 py-8 font-[Lato] text-[14px]`}
    >
      {/* Tombol Sebelumnya */}
      <a
        href="#"
        className="text-primary font-medium flex items-center gap-1 hover:underline"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 
            3.293a1 1 0 01-1.414 1.414l-4-4a1 
            1 0 010-1.414l4-4a1 1 0 
            011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
        Sebelumnya
      </a>

      {/* Nomor halaman */}
      <a
        href="#"
        className="text-primary font-medium underline underline-offset-4"
      >
        1
      </a>
      <a
        href="#"
        className="text-primary font-medium hover:underline underline-offset-4"
      >
        2
      </a>
      <span className="text-primary font-medium">...</span>
      <a
        href="#"
        className="text-primary font-medium hover:underline underline-offset-4"
      >
        5
      </a>

      {/* Tombol Selanjutnya */}
      <a
        href="#"
        className="text-primary font-medium flex items-center gap-1 hover:underline"
      >
        Selanjutnya
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 
            10 7.293 6.707a1 1 0 011.414-1.414l4 
            4a1 1 0 010 1.414l-4 4a1 1 0-1.414 
            0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </div>
  );
}

export default Pagination;
