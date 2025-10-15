"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

function waHref(phone?: string, message?: string) {
  const num = (phone ?? "").toString().replace(/\D/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return num ? `https://wa.me/${num}${q}` : "#";
}

export default function HubungiKamiButton({
  phone,
  label = "Contact Us",
  message,
  className = "",
}: {
  phone?: string;
  label?: string;
  message?: string;
  className?: string;
}) {
  const href = waHref(phone, message);
  const disabled = href === "#";

  return (
    <a
      href={href}
      target={disabled ? "_self" : "_blank"}
      rel={disabled ? undefined : "noopener noreferrer"}
      aria-label={label}
      aria-disabled={disabled}
      className={[
        "fixed right-6 bottom-20 z-[9999]",
        "flex items-center gap-2 px-6 py-3 rounded-full",
        "bg-[#128C47] text-white",
        "hover:bg-[#0E7038] transition",
        "shadow-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]", // ← aman, tanpa abu2 melingkar
        "ring-0 outline-none focus:outline-none",                 // ← cegah ring abu
        "pointer-events-auto isolation-auto",                      // ← hindari efek blending
        className,
      ].join(" ")}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
    >
      <FaWhatsapp className="h-5 w-5" aria-hidden />
      <span className="font-medium">{label}</span>
    </a>
  );
}
