import { Inter } from "next/font/google";
import ContactMap from "./_components/old/ContactMap";
import ContactForm from "./_components/ContactForm";
import type { Locale } from "../../../../../i18n-config";
import getDictionaryContact from "../../../../../dictionaries/contact/get-dictionary-contact";
import ContactHeader from "./_components/ContactHeader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
});

export type PageProps = {
  params: { lang: Locale };
};

export default async function Page({ params }: PageProps) {
  const { lang } = params;
  const dictionaryContact = await getDictionaryContact(lang);

  return (
    <div className={inter.className}>
      <ContactHeader dictionaryContact={dictionaryContact} />
      <ContactForm dictionaryContact={dictionaryContact} />
      {/* <ContactInfo dictionaryContact={dictionaryContact} lang={lang} /> */}
      <ContactMap />
    </div>
  );
}
