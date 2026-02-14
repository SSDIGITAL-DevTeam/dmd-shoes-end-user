import { Inter } from "next/font/google";
import type { PagePropsP, LangParamsP } from "@/types/next";
import getDictionaryContact from "../../../../../dictionaries/contact/get-dictionary-contact";
import ContactHeader from "./_components/ContactHeader";
import ContactForm from "./_components/ContactForm";
import ContactMap from "./_components/old/ContactMap";
import { generateMetadata as buildMetadata } from "@/app/utils/generateMetadata";
import { pageMetadata } from "@/constant/metadata";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export async function generateMetadata() {
  const meta = pageMetadata.contact;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    path: "/contact",
    locale: meta.openGraph.locale,
    openGraphOverride: meta.openGraph,
    twitterOverride: meta.twitter,
    cmsPath: "contact",
  });
}

export default async function Page({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;
  const dictionaryContact = await getDictionaryContact(lang);

  return (
    <div className={inter.className}>
      <ContactHeader dictionaryContact={dictionaryContact} />
      <ContactForm dictionaryContact={dictionaryContact} />
      <ContactMap />
    </div>
  );
}
