import { getDictionaryAbout as getDictionaryHome } from "../../../../../dictionaries/home/get-dictionary-home";
import { Locale } from "../../../../../i18n-config";
import HomePageClient from "./HomePageClient";
import { BootstrapService, type HomeBootstrapResponse } from "@/services/bootstrap.service";

export default async function IndexPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

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

export const metadata = {
  title: "About Our Company",
  description: "Learn more about our company",
};
