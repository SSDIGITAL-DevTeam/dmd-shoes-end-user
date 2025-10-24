"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

function waHref(phone: string, message?: string) {
  const num = phone.replace(/\D/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${q}`;
}

export default function ContactUsButton({
  phone,
  label,
  message,
  className = "",
}: {
  phone: string;
  label: string;
  message?: string;
  className?: string;
}) {
  const classes = [
    "fixed right-6 bottom-6 z-[9999]",
    "flex items-center gap-2 px-6 py-3 rounded-full shadow-lg",
    "bg-[#128C47] text-white hover:bg-[#0E7038] transition",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={waHref(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={classes}
    >
      <FaWhatsapp aria-hidden className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </a>
  );
}
