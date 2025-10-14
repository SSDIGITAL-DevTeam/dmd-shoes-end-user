import type { Locale } from "../../../../../i18n-config";

type FlagProps = { className?: string };

export function USFlag({ className = "w-5 h-5" }: FlagProps) {
  return (
    <svg viewBox="0 0 7410 3900" className={className} aria-hidden="true">
      <rect width="7410" height="3900" fill="#b22234" />
      <g fill="#fff">
        <rect width="7410" height="300" y="300" />
        <rect width="7410" height="300" y="900" />
        <rect width="7410" height="300" y="1500" />
        <rect width="7410" height="300" y="2100" />
        <rect width="7410" height="300" y="2700" />
        <rect width="7410" height="300" y="3300" />
      </g>
      <rect width="2964" height="2100" fill="#3c3b6e" />
    </svg>
  );
}

export function IDFlag({ className = "w-5 h-5" }: FlagProps) {
  return (
    <svg viewBox="0 0 640 480" className={className} aria-hidden="true">
      <rect width="640" height="240" fill="#ff0000" />
      <rect width="640" height="240" y="240" fill="#ffffff" />
    </svg>
  );
}

/** Label bisa string ATAU object { en, id } */
export type LocaleLabel = string | Record<Locale, string>;

export type LocaleItem = {
  code: Locale;
  label: LocaleLabel;
  flag: JSX.Element;
};

const locales: LocaleItem[] = [
  { code: "en", label: { en: "English (EN)", id: "Bahasa Inggris (EN)" }, flag: <USFlag /> },
  { code: "id", label: { en: "Indonesian (ID)", id: "Bahasa Indonesia (ID)" }, flag: <IDFlag /> },
];

export default locales;

/** Helper untuk mengambil label sesuai UI locale */
export function resolveLocaleLabel(item: LocaleItem, uiLocale: Locale): string {
  return typeof item.label === "string" ? item.label : item.label[uiLocale];
}
