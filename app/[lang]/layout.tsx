import { getDictionary } from "../../dictionaries/get-dictionary";
import { i18n, type Locale } from "../../i18n-config";
import AuthInitializer from "@/components/providers/AuthInitializer";
import ToastProvider from "@/components/providers/ToastProvider";
import { ReactQueryProvider } from "../../components/providers/ReactQueryProvider";
import {
  inter, assistant, lato, poppins, plusJakartaSans,
} from "./config/font";
import HubungiKamiButton from "@/components/ui/ContactUs"; // ← tambah ini
import "./global.css";

export const metadata = {
  title: "DMD ShoeParts Manufacturing",
  description: "How to do i18n in Next.js 15 within app router",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const { children } = props;

  // Ambil dictionary per-bahasa
  const dict = await getDictionary(params.lang);

  // Ambil label & pesan dari dictionary (ubah path sesuai struktur dictionary kamu)
  // Contoh A: kalau kamu punya "common.cta.whatsappLabel" & "common.cta.whatsappMessage"
  const waLabel =
    dict?.common?.cta?.whatsappLabel ??
    (params.lang === "en" ? "Contact Us" : "Hubungi Kami");

  const waMessage =
    dict?.common?.cta?.whatsappMessage ??
    (params.lang === "en"
      ? "Hello DMD, I’d like to ask about shoe component production."
      : "Halo DMD, saya ingin bertanya tentang produksi komponen sepatu.");

  // Atau Contoh B: pakai yang sudah ada di about/contactSupport (silakan pilih salah satu)
  // const waLabel = dict?.about?.contactSupport?.button ?? (params.lang === "en" ? "Contact Us" : "Hubungi Kami");
  // const waMessage = params.lang === "en"
  //   ? "Hello DMD, I’d like to ask about shoe component production."
  //   : "Halo DMD, saya ingin bertanya tentang produksi komponen sepatu.";

  const waPhone = process.env.NEXT_PUBLIC_WA_NUMBER || "+6285183006681";

  return (
    <html lang={params.lang}>
      <body
        className={`${inter.className} ${assistant.variable} ${lato.variable} ${poppins.variable} ${plusJakartaSans.variable} antialiased min-h-screen bg-[var(--surface)] text-[var(--text-primary)]`}
      >
        <ReactQueryProvider>
          <AuthInitializer />
          <ToastProvider />
          {children}

          {/* Floating button global: ikut re-render saat /[lang] berubah */}
          <HubungiKamiButton phone={waPhone} label={waLabel} message={waMessage} />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
