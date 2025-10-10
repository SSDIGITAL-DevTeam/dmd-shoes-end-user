import { getDictionary } from "../../../dictionaries/get-dictionary";
import { type Locale } from "../../../i18n-config";
import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import FloatingContact from "@/components/layout/FloatingContact";
import { CONTACT } from "@/config/contact";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dictionary={dictionary} />
      {children}
      <Footer lang={lang} dictionary={dictionary} />
      <FloatingContact whatsapp={CONTACT.whatsapp} />
    </>
  );
}
