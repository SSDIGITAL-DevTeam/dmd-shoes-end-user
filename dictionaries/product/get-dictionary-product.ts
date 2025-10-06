import "server-only";
import type { Locale } from "../../i18n-config";

const dictionaries = {
  en: () => import("./en.json").then((m) => m.default),
  id: () => import("./id.json").then((m) => m.default),
};

export const getDictionaryProduct = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();

