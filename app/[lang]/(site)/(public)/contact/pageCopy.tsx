import React from "react";
import { Inter } from "next/font/google";
import Container from "@/components/ui-custom/Container";
import { FaArrowRight } from "react-icons/fa";
import ContactInfo from "./_components/old/ContactInfo"
import ContactMap from "./_components/old/ContactMap";
import ContactForm from "./_components/old/ContactForm";
import type { Locale } from "../../../../../i18n-config";
import getDictionaryContact from '../../../../../dictionaries/contact/get-dictionary-contact';

//import { getDictionaryAbout } from '../../../dictionaries/about/get-dictionary-about';
// load inter dari google font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400"], // regular
});



async function Page(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const { children } = props;
  const lang = await params.lang;
  const dictionaryContact= await getDictionaryContact(lang);
  return (
    <div className={` ${inter.className} `}>
  
      <ContactForm dictionaryContact={dictionaryContact} lang={lang} />
      <ContactInfo dictionaryContact={dictionaryContact} lang={lang}></ContactInfo>
      <ContactMap></ContactMap>
    </div>
  );
}

export default Page;