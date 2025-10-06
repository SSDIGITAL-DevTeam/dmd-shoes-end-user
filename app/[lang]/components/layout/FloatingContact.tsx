"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function HubungiKamiButton({ whatsapp }: { whatsapp: string }) {
  return (
    <Link
      href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
      target="_blank"
      aria-label="Hubungi kami via WhatsApp"
      className="fixed bottom-20 right-6 flex items-center gap-2 bg-[#128C47] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#0E7038] transition"
    >
      <FaWhatsapp size={20} aria-hidden="true" />
      <span className="font-medium">Hubungi Kami</span>
    </Link>
  );
}
