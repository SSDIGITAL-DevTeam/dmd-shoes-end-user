import type { PagePropsP, LangParamsP } from "@/types/next";
import Wishlist from "./_components/Wishlist";
import { getDictionaryWishlist } from "../../../../../dictionaries/wishlist/get-dictionary-wishlist";

export default async function WishlistPage({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params;
  const dictionary = await getDictionaryWishlist(lang);

  return <Wishlist lang={lang} dictionary={dictionary} />;
}
