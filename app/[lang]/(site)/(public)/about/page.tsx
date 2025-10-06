// app/[lang]/(site)/(public)/about/page.tsx
import React from "react";
import { Inter } from "next/font/google";
import type { Locale } from "../../../../../i18n-config";
import { getDictionaryAbout } from "../../../../../dictionaries/about/get-dictionary-about";

import About from "./_component/About";
import FeaturesSection from "./_component/FeaturesSection";
import HelpSection from "./_component/HelpSection";

// Next.js Google font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
});

// Props type for App Router


// Optional: static revalidate (if you fetch dynamic data)
export const revalidate = 0;

// Generate metadata dynamically based on `params.lang`
// **Static manual metadata**

// Page component (server component)
export default async function IndexPage({
  params,
}: {
  params: { lang: Locale }; // inline, jangan pakai PageProps
}) {

  const { lang } = params;

  // Fetch dictionary (async OK in server component)
  const dictionaryAbout = await getDictionaryAbout(params.lang);

  return (
    <div className={inter.className}>
      <About dictionaryAbout={dictionaryAbout} lang={lang} />
      <FeaturesSection dictionaryAbout={dictionaryAbout} lang={lang} />
      <HelpSection  dictionaryAbout={dictionaryAbout} lang={lang} />
    </div>
  );
}

export const metadata = {
  title: "About Our Company",
  description: "Learn more about our company",
  
};