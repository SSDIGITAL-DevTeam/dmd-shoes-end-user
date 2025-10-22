import { Inter } from "next/font/google";
import type { PagePropsP, LangParamsP } from "@/types/next";
import { getDictionaryAbout } from "../../../../../dictionaries/about/get-dictionary-about";
import About from "./_component/About";
import FeaturesSection from "./_component/FeaturesSection";
import HelpSection from "./_component/HelpSection";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });
export const revalidate = 0;

export const metadata = {
  title: "About Our Company",
  description: "Learn more about our company",
};

export default async function AboutPage({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;
  const dictionaryAbout = await getDictionaryAbout(lang);

  return (
    <div className={inter.className}>
      <About dictionaryAbout={dictionaryAbout} lang={lang} />
      <FeaturesSection dictionaryAbout={dictionaryAbout} lang={lang} />
      <HelpSection dictionaryAbout={dictionaryAbout} lang={lang} />
    </div>
  );
}
