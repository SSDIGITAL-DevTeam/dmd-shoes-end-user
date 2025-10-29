import type { PagePropsP, LangParamsP } from "@/types/next";
import { getDictionaryAbout as getDictionaryHome } from "../../../../../dictionaries/home/get-dictionary-home";
import HomePageClient from "./HomePageClient";
import { BootstrapService, type HomeBootstrapResponse } from "@/services/bootstrap.service";

export const metadata = {
  title: "Home - DMD ShoeParts Manufacturing",
  description: "Innovative solutions for the future of footwear components",
};

export default async function IndexPage({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;

  const [homeDictionary, bootstrap] = await Promise.all([
    getDictionaryHome(lang),
    fetchBootstrap(lang),
  ]);

  return (
    <HomePageClient
      lang={lang}
      homeDictionary={homeDictionary}
      initialBootstrap={bootstrap}
    />
  );
}

const fetchBootstrap = async (lang: string): Promise<HomeBootstrapResponse | undefined> => {
  try {
    return await BootstrapService.home({ lang });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch home bootstrap", error);
    }
    return undefined;
  }
};
