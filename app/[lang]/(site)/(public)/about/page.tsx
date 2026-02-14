import { Inter } from "next/font/google";
import type { PagePropsP, LangParamsP } from "@/types/next";
import { getDictionaryAbout } from "../../../../../dictionaries/about/get-dictionary-about";
import About from "./_component/About";
import FeaturesSection from "./_component/FeaturesSection";
import HelpSection from "./_component/HelpSection";
import { generateMetadata as buildMetadata } from "@/app/utils/generateMetadata";
import { pageMetadata } from "@/constant/metadata";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });
export const revalidate = 0;

export async function generateMetadata() {
  const meta = pageMetadata.about;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    path: "/about",
    locale: meta.openGraph.locale,
    openGraphOverride: meta.openGraph,
    twitterOverride: meta.twitter,
    cmsPath: "about",
  });
}

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
