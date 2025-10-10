"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import Container from "@/components/ui-custom/Container";
import { CONTACT } from "@/config/contact";
import { useFavorites } from "@/hooks/useFavorites";
import type { FavoriteItem, MultiLangValue } from "@/services/types";

const FALLBACK_IMAGE = "/assets/demo/demo-product.png";

type WishlistDictionary = {
  pageTitle?: string;
  pageTitleCount?: string;
  sectionTitle?: string;
  selectAll?: string;
  loading?: string;
  empty?: string;
  fallbackProductName?: string;
  priceUnit?: string;
  removeLabel?: string;
  selectedCount?: string;
  whatsapp?: {
    emptyMessage?: string;
    intro?: string;
    outro?: string;
    line?: string;
    button?: string;
    preparing?: string;
  };
};

const formatTemplate = (template: string, replacements: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? "");

const createFallbackDictionary = (lang: string): Required<WishlistDictionary> & {
  whatsapp: Required<NonNullable<WishlistDictionary["whatsapp"]>>;
} => {
  const isEnglish = lang.startsWith("en");
  return {
    pageTitle: isEnglish ? "My Favorites" : "Favorit Saya",
    pageTitleCount: isEnglish ? "({count} Products)" : "({count} Produk)",
    sectionTitle: isEnglish ? "Products in My Favorites" : "Produk Di Favorit Saya",
    selectAll: isEnglish ? "Select All" : "Pilih Semua",
    loading: isEnglish ? "Loading favorites..." : "Memuat daftar favorit...",
    empty: isEnglish ? "You don't have any favorites yet." : "Belum ada produk di daftar favorit Anda.",
    fallbackProductName: isEnglish ? "Product" : "Produk",
    priceUnit: isEnglish ? "/ pair" : "/ pasang",
    removeLabel: isEnglish ? "Remove from favorites" : "Hapus dari favorit",
    selectedCount: isEnglish ? "{count} Products Selected" : "{count} Produk Dipilih",
    whatsapp: {
      emptyMessage: isEnglish
        ? "Hi, DMD Shoes. I'd like to ask about my favorite products."
        : "Hi, DMD Shoes. Saya ingin bertanya mengenai produk favorit saya.",
      intro: isEnglish
        ? "Hi, DMD Shoes. I'm interested in the following products:"
        : "Hi, DMD Shoes. Saya tertarik dengan produk berikut:",
      outro: isEnglish
        ? "Please share availability and how to place an order."
        : "Mohon informasi ketersediaan dan cara pemesanan.",
      line: "{index}. {product}{variant} - {price}",
      button: isEnglish ? "Order via WhatsApp Now" : "Pesan Melalui WhatsApp Sekarang",
      preparing: isEnglish ? "Preparing..." : "Menyiapkan...",
    },
  };
};

const resolveText = (
  value: MultiLangValue | string | null | undefined,
  lang: string,
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    if (lang in value && typeof value[lang] === "string") {
      return value[lang] as string;
    }
    if (typeof value.id === "string") return value.id;
  }

  return "";
};

const Wishlist = ({
  lang = "id",
  dictionary,
}: {
  lang?: string;
  dictionary?: WishlistDictionary;
}) => {
  const {
    favorites,
    isLoading,
    removeFavorite,
    checkout,
    isRemoving,
    isCheckingOut,
  } = useFavorites();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const locale = lang.startsWith("en") ? "en-US" : "id-ID";
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }),
    [locale],
  );

  const baseDict = useMemo(() => createFallbackDictionary(lang), [lang]);
  const mergedDict = useMemo(() => {
    const incomingWhatsApp = dictionary?.whatsapp ?? {};
    return {
      ...baseDict,
      ...dictionary,
      whatsapp: {
        ...baseDict.whatsapp,
        ...incomingWhatsApp,
      },
    };
  }, [baseDict, dictionary]);

  const formatCurrency = useCallback(
    (value?: number | string | null) => {
      if (value === null || value === undefined) return "-";
      const numeric = typeof value === "string" ? Number(value) : value;
      if (typeof numeric !== "number" || Number.isNaN(numeric)) return "-";
      return currencyFormatter.format(numeric);
    },
    [currencyFormatter],
  );

  useEffect(() => {
    if (!favorites.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds((prev) => {
      if (prev.length === 0) {
        return favorites.map((fav) => fav.favorite_id);
      }
      const existing = new Set(prev);
      const next = favorites
        .filter((fav) => existing.has(fav.favorite_id))
        .map((fav) => fav.favorite_id);
      return next.length > 0 ? next : favorites.map((fav) => fav.favorite_id);
    });
  }, [favorites]);

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(favorites.map((fav) => fav.favorite_id));
      } else {
        setSelectedIds([]);
      }
    },
    [favorites],
  );

  const toggleSelect = useCallback((favoriteId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(favoriteId)) {
        return prev.filter((id) => id !== favoriteId);
      }
      return [...prev, favoriteId];
    });
  }, []);

  const handleRemove = useCallback(
    async (favorite: FavoriteItem) => {
      await removeFavorite({
        productId: favorite.product.id,
        variantId: favorite.variant?.id ?? null,
      });
      setSelectedIds((prev) =>
        prev.filter((id) => id !== favorite.favorite_id),
      );
    },
    [removeFavorite],
  );

  const selectedFavorites = useMemo(
    () => favorites.filter((fav) => selectedIds.includes(fav.favorite_id)),
    [favorites, selectedIds],
  );

  const whatsappMessage = useMemo(() => {
    if (!selectedFavorites.length) {
      return mergedDict.whatsapp.emptyMessage;
    }

    const lines = selectedFavorites.map((fav, index) => {
      const productName =
        resolveText(fav.product.name, lang) || mergedDict.fallbackProductName;
      const variantText = fav.variant
        ? fav.variant.label_text ?? resolveText(fav.variant.label, lang) ?? ""
        : "";
      const variantLabel = variantText ? ` (${variantText})` : "";
      const price = fav.variant?.price ?? fav.product.price ?? undefined;

      return formatTemplate(mergedDict.whatsapp.line, {
        index: String(index + 1),
        product: productName,
        variant: variantLabel,
        price: formatCurrency(price),
      });
    });

    return `${mergedDict.whatsapp.intro}\n\n${lines.join("\n")}\n\n${mergedDict.whatsapp.outro}`;
  }, [selectedFavorites, lang, mergedDict, formatCurrency]);

  const handleCheckout = useCallback(async () => {
    if (!selectedFavorites.length) return;

    try {
      await checkout({
        favorite_ids: selectedFavorites.map((item) => item.favorite_id),
      });
    } catch (error) {
      console.error("Checkout favorites failed", error);
    }
  }, [checkout, selectedFavorites]);

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-semibold text-[#003663] lg:text-[32px]">
          {mergedDict.pageTitle}{" "}
          <span className="text-base font-normal text-gray-500 lg:text-lg">
            {formatTemplate(mergedDict.pageTitleCount, {
              count: numberFormatter.format(favorites.length),
            })}
          </span>
        </h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full rounded-[16px] border border-[#EEEEEE] bg-white lg:w-[65%]">
          <h2 className="p-6 text-lg font-semibold">{mergedDict.sectionTitle}</h2>

          <div className="flex items-center gap-2 px-6 py-2">
            <input
              type="checkbox"
              disabled={isLoading || !favorites.length}
              checked={
                Boolean(favorites.length) &&
                selectedIds.length === favorites.length
              }
              onChange={(event) => toggleSelectAll(event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="font-inter text-[20px] font-semibold text-[#121212] lg:text-[22px]">
              {mergedDict.selectAll}
            </span>
          </div>

          <div className="bg-[#F5F5F5]">
            {isLoading ? (
              <p className="px-6 py-10 text-sm text-gray-500">
                {mergedDict.loading}
              </p>
            ) : favorites.length === 0 ? (
              <p className="px-6 py-10 text-sm text-gray-500">
                {mergedDict.empty}
              </p>
            ) : (
              favorites.map((favorite) => {
                const productName =
                  resolveText(favorite.product.name, lang) ||
                  mergedDict.fallbackProductName;
                const productCode = favorite.product?.slug ?? "";
                const variantLabelText =
                  favorite.variant?.label_text ??
                  resolveText(favorite.variant?.label ?? null, lang);
                const variantParts = variantLabelText
                  ? variantLabelText
                      .split("|")
                      .map((part) => part.trim())
                      .filter(Boolean)
                  : [];
                const price =
                  favorite.variant?.price ?? favorite.product.price ?? null;

                const coverSrc =
                  (typeof favorite.product.cover_url === "string" &&
                  favorite.product.cover_url.length > 0
                    ? favorite.product.cover_url
                    : undefined) ??
                  (typeof favorite.product.cover === "string" &&
                  favorite.product.cover.length > 0
                    ? favorite.product.cover
                    : undefined) ??
                  FALLBACK_IMAGE;

                return (
                  <div
                    key={favorite.favorite_id}
                    className="flex items-center gap-4 px-8 py-3 lg:gap-6"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(favorite.favorite_id)}
                      onChange={() => toggleSelect(favorite.favorite_id)}
                      className="h-4 w-4 accent-primary"
                    />

                    <div>
                      <Image
                        src={coverSrc}
                        alt={productName}
                        width={70}
                        height={70}
                        className="h-[70px] w-[70px] rounded border object-contain lg:h-[60px] lg:w-[60px]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-2 lg:flex-row lg:items-center">
                      <div>
                        <p className="font-inter text-[20px] font-semibold leading-[150%] lg:text-[24px]">
                          {productName}
                        </p>
                        {productCode ? (
                          <p className="font-inter text-[18px] leading-[150%] text-primary lg:text-[20px]">
                            {productCode.toUpperCase()}
                          </p>
                        ) : null}
                        {variantParts.map((part) => (
                          <p
                            key={part}
                            className="font-inter text-[18px] leading-[150%] text-[#121212] lg:text-[20px]"
                          >
                            {part}
                          </p>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3 lg:mt-0 lg:justify-end">
                        <span className="text-sm font-semibold lg:text-base">
                          {`${formatCurrency(price)} ${mergedDict.priceUnit}`}
                        </span>
                        <button
                          onClick={() => handleRemove(favorite)}
                          disabled={isRemoving}
                          className="rounded bg-red-600 px-3 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={mergedDict.removeLabel}
                          type="button"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="h-auto w-full rounded-[16px] border border-[#EEEEEE] bg-white p-6 lg:w-124">
          <p className="font-medium">
            {formatTemplate(mergedDict.selectedCount, {
              count: numberFormatter.format(selectedFavorites.length),
            })}
          </p>

          <Link
            href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
              whatsappMessage,
            )}`}
            onClick={handleCheckout}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaWhatsapp />
            {isCheckingOut
              ? mergedDict.whatsapp.preparing
              : mergedDict.whatsapp.button}
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Wishlist;
