import { getDictionary } from "../../dictionaries/get-dictionary";
import { i18n, type Locale } from "../../i18n-config";
import AuthInitializer from "@/components/providers/AuthInitializer";
import ToastProvider from "@/components/providers/ToastProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import HubungiKamiButton from "@/components/ui/ContactUs";

export const metadata = {
  title: "DMD ShoeParts Manufacturing",
  description: "E-commerce sepatu by DMD",
};

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const waLabel =
    dict?.common?.cta?.whatsappLabel ?? (lang === "en" ? "Contact Us" : "Hubungi Kami");

  const waMessage =
    dict?.common?.cta?.whatsappMessage ??
    (lang === "en"
      ? "Hello DMD, I’d like to ask about shoe component production."
      : "Halo DMD, saya ingin bertanya tentang produksi komponen sepatu.");

  const waPhone = process.env.NEXT_PUBLIC_WA_NUMBER || "+6285183006681";

  return (
    <>
      <ReactQueryProvider>
        <AuthInitializer />
        <ToastProvider />
        {children}
        <HubungiKamiButton phone={waPhone} label={waLabel} message={waMessage} />
      </ReactQueryProvider>
    </>
  );
}
