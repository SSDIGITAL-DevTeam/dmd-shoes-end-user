// src/app/layout.tsx (DMD)

import "./global.css";
import type { Metadata } from "next";
import {
  assistant,
  inter,
  lato,
  plusJakartaSans,
  poppins,
} from "@/config/font";
import OrganizationSchema from "@/../../app/seo/schema/OrganitazionSchema";

// Metadata utama untuk seluruh site
export const metadata: Metadata = {
  title: "DMD ShoeParts Manufacturing",
  description:
    "DMD ShoeParts menyediakan berbagai kebutuhan sparepart dan perlengkapan sepatu berkualitas untuk industri dan UMKM.",
  metadataBase: new URL("https://www.dmdshoeparts.com"),
  openGraph: {
    title: "DMD ShoeParts Manufacturing",
    description:
      "Pusat sparepart dan perlengkapan sepatu berkualitas dengan pilihan produk lengkap.",
    url: "https://www.dmdshoeparts.com",
    siteName: "DMD ShoeParts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DMD ShoeParts Manufacturing",
    description:
      "E-commerce sparepart dan perlengkapan sepatu dari DMD ShoeParts.",
  },
};

const assetPreconnects = [
  "https://api.dmdshoeparts.com",
  "https://dmdshoeparts.com",
  "https://www.dmdshoeparts.com",
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect untuk font & asset, sama seperti sebelumnya */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {assetPreconnects.map((href) => (
          <link
            key={href}
            rel="preconnect"
            href={href}
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body
        className={[
          inter.className,
          assistant.variable,
          lato.variable,
          poppins.variable,
          plusJakartaSans.variable,
          "antialiased min-h-screen bg-[var(--surface)] text-[var(--text-primary)]",
        ].join(" ")}
      >
        {/* ✅ Structured data Organization, sama konsepnya dengan Octobees */}
        <OrganizationSchema />

        {children}
      </body>
    </html>
  );
}
