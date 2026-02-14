import type { PagePropsP, LangParamsP } from "@/types/next";
import { getDictionaryAbout as getDictionaryHome } from "../../../../../dictionaries/home/get-dictionary-home";
import HomePageClient from "./HomePageClient";
import { BootstrapService, type HomeBootstrapResponse } from "@/services/bootstrap.service";
import { generateMetadata as buildMetadata } from "@/app/utils/generateMetadata";
import { pageMetadata } from "@/constant/metadata";

export async function generateMetadata() {
  const meta = pageMetadata.home;
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    path: "/",
    locale: meta.openGraph.locale,
    openGraphOverride: meta.openGraph,
    twitterOverride: meta.twitter,
    cmsPath: "home",
  });
}

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
