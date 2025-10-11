import "server-only";
import type { Locale } from "../../i18n-config";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  id: () => import("./id.json").then((module) => module.default),
};

export const getDictionaryProfile = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
