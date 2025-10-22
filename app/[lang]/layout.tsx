import type { ReactNode } from "react";
import { i18n } from "../../i18n-config";

import AuthInitializer from "@/components/providers/AuthInitializer";
import ToastProvider from "@/components/providers/ToastProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import HubungiKamiButton from "@/components/ui/ContactUs";
import { inter, assistant, lato, poppins, plusJakartaSans } from "./config/font";
import "../global.css";

export const metadata = {
  title: "DMD Shoes",
  description: "DMD Shoes",
};

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

function joinClasses(...xs: Array<string | undefined | null | false>) {
  return xs.filter(Boolean).join(" ");
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>; // ✅ sesuai validator
}) {
  const { lang } = await params;
  const safeLang = lang === "en" || lang === "id" ? lang : "id";

  const bodyClass = joinClasses(
    inter.className,
    assistant.variable,
    lato.variable,
    poppins.variable,
    plusJakartaSans.variable,
    "antialiased"
  );

  const waPhone = process.env.NEXT_PUBLIC_WA_NUMBER || "+6285183006681";
  const waLabel = safeLang === "en" ? "Contact Us" : "Hubungi Kami";
  const waMessage =
    safeLang === "en"
      ? "Hello DMD, I’d like to ask about shoe component production."
      : "Halo DMD, saya ingin bertanya tentang produksi komponen sepatu.";

  return (
    <html lang={safeLang}>
      <body className={bodyClass} suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthInitializer />
          <ToastProvider />
          <main>{children}</main>
          <HubungiKamiButton phone={waPhone} label={waLabel} message={waMessage} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
