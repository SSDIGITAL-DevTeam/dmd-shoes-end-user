import Wishlist from "./_components/Wishlist";
import type { Locale } from "../../../../../i18n-config";
import { getDictionaryWishlist } from "../../../../../dictionaries/wishlist/get-dictionary-wishlist";

export default async function WishlistPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dictionary = await getDictionaryWishlist(lang);

  return (
    <div>
      <Wishlist lang={lang} dictionary={dictionary} />
    </div>
  );
}
