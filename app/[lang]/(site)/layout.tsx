import type { ReactNode } from "react";
import { getDictionary } from "../../../dictionaries/get-dictionary";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { CONTACT } from "@/config/contact";

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>; // ✅ sesuai validator
}) {
  const { lang } = await params;
  const safeLang = lang === "en" || lang === "id" ? lang : "id";
  const dictionary = await getDictionary(safeLang).catch(() => undefined as any);

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={safeLang} dictionary={dictionary} />
      <main className="flex-1">{children}</main>
      <Footer lang={safeLang} dictionary={dictionary} />
      <FloatingContact
        phone={CONTACT.whatsapp}
        label={safeLang === "en" ? "Contact Us" : "Hubungi Kami"}
        message={
          safeLang === "en"
            ? "Hello DMD, I’d like to ask about shoe component production."
            : "Halo DMD, saya ingin bertanya tentang produksi komponen sepatu."
        }
      />
    </div>
  );
}
