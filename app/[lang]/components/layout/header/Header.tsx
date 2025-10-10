import Navbar from "./Navbar";

type HeaderDictionary = {
  menu?: {
    home?: string;
    products?: string;
    articles?: string;
    about_us?: string;
    contact_us?: string;
  };
  auth?: Partial<Record<"register" | "login" | "wishlist" | "account", string>>;
  home?: { auth?: Partial<Record<"register" | "login" | "wishlist" | "account", string>> };
};

export default function Header({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: HeaderDictionary;
}) {
  return <Navbar lang={lang} dictionary={dictionary} />;
}
