import { getDictionary } from "../../../dictionaries/get-dictionary";
import { i18n, type Locale } from "../../../i18n-config";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import FloatingContact from "@/components/layout/FloatingContact";
import { inter } from "@/config/font";
import { CONTACT } from "@/config/contact";

export const metadata = {
  title: "DMD Shoes",
  description: "DMD Shoes",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const lang = await params.lang;
  const { children } = props;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={params.lang}>
      <body className={`${inter.className} antialiased`}>
        <Header lang={params.lang} dictionary={dictionary} />
        {children}
        <Footer lang={params.lang} dictionary={dictionary} />
        <FloatingContact whatsapp={CONTACT.whatsapp} />
      </body>
    </html>
  );
}
