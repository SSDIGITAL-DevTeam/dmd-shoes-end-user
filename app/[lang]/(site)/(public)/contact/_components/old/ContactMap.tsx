"use client";

import React from "react";

/**
 * Cara pakai:
 * - Letakkan file ini sebagai `app/peta/page.tsx` (Next.js 13+ app router)
 * - Atau jadikan komponen <GoogleMapsEmbed /> dipakai di halaman mana pun.
 *
 * Catatan:
 * - Ini menggunakan <iframe> public Google Maps, TIDAK butuh API key.
 * - Jika ingin kontrol penuh (marker custom, event, dsb.), gunakan Maps JavaScript API (butuh API key & billing).
 */

const ADDRESS =
  "Pergudangan Mutiara Kosambi 2 Blok A6 No.22, Dadap - Tangerang";

const buildEmbedSrc = (query: string) => {
  // Gunakan endpoint maps public + output=embed
  const q = encodeURIComponent(query);
  // z=20 untuk zoom yang mirip dengan URL yang Anda kirim (20z)
  return `https://www.google.com/maps?q=${q}&z=20&hl=id&output=embed`;
};

function GoogleMapsEmbed({ query }: { query: string }) {
  const src = buildEmbedSrc(query);
  return (
    <div className="w-full max-w-screen-xl mx-auto p-6">
      {/* <h1 className="text-[28px] md:text-[36px] font-semibold text-[#003663] mb-4">
        Lokasi Gudang
      </h1>
      <p className="text-[16px] md:text-[18px] text-gray-700 mb-6">
        {query}
      </p> */}

      {/* Wrapper untuk menjaga rasio dan responsif */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          title="Peta Lokasi"
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* <div className="mt-4 text-sm text-gray-500">
        Sumber: Google Maps (iframe publik, tanpa API key)
      </div> */}
    </div>
  );
}

export default function ContactMap() {
  return <GoogleMapsEmbed query={ADDRESS} />;
}

/**
 * --- Opsi Alternatif (Advanced, dengan API Key) ---
 * Jika ingin kontrol penuh, pakai Maps JavaScript API.
 * 1) `npm i @googlemaps/js-api-loader`
 * 2) Buat .env.local -> NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=XXXX
 * 3) Contoh minimal:
 *
 * "use client";
 * import { Loader } from "@googlemaps/js-api-loader";
 * import { useEffect, useRef } from "react";
 *
 * function MapJS() {
 *   const mapRef = useRef<HTMLDivElement>(null);
 *   useEffect(() => {
 *     const loader = new Loader({
 *       apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
 *       version: "weekly",
 *     });
 *     loader.load().then((google) => {
 *       const center = { lat: -6.097994, lng: 106.6869771 };
 *       const map = new google.maps.Map(mapRef.current!, {
 *         center,
 *         zoom: 20,
 *         mapId: "DEMO_MAP_ID", // opsional jika pakai Cloud Styled Map
 *       });
 *       new google.maps.Marker({ position: center, map, title: "Gudang" });
 *     });
 *   }, []);
 *   return <div ref={mapRef} className="w-full h-[60vh]" />;
 * }
 */
