"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaTrash, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import clsx from "clsx";
import Container from "@/components/ui-custom/Container";
import { CONTACT } from "@/config/contact";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
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
  email?: {
    emptyMessage?: string;
    intro?: string;
    outro?: string;
    subject?: string;
    line?: string;
    button?: string;
  };
};

const formatTemplate = (template: string, replacements: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? "");

const createFallbackDictionary = (lang: string): Required<WishlistDictionary> & {
  whatsapp: Required<NonNullable<WishlistDictionary["whatsapp"]>>;
  email: Required<NonNullable<WishlistDictionary["email"]>>;
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
      button: isEnglish ? "Order via WhatsApp" : "Pesan Melalui WhatsApp",
      preparing: isEnglish ? "Preparing..." : "Menyiapkan...",
    },
    email: {
      emptyMessage: isEnglish
        ? "Hello, I’d like to ask about my favorite products."
        : "Halo, saya ingin bertanya mengenai produk favorit saya.",
      intro: isEnglish
        ? "Hello, I’m interested in the following products:"
        : "Halo, saya tertarik dengan produk berikut:",
      outro: isEnglish
        ? "Please let me know the availability and how to proceed with the order."
        : "Mohon informasikan ketersediaan dan langkah pemesanan selanjutnya.",
      subject: isEnglish
        ? "Order Inquiry - {count} Products"
        : "Permintaan Pesanan - {count} Produk",
      line: "{index}. {product}{variant} - {price}",
      button: isEnglish ? "Order via Email" : "Pesan Melalui Email",
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
    if (lang in value && typeof (value as any)[lang] === "string") {
      return (value as any)[lang] as string;
    }
    if (typeof (value as any).id === "string") return (value as any).id;
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
  const { favorites, isLoading, removeFavorite, checkout, isRemoving, isCheckingOut } =
    useFavorites();
  const { user } = useAuth();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

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
    const incomingEmail = dictionary?.email ?? {};
    return {
      ...baseDict,
      ...dictionary,
      whatsapp: {
        ...baseDict.whatsapp,
        ...incomingWhatsApp,
      },
      email: {
        ...baseDict.email,
        ...incomingEmail,
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
      if (prev.length === 0) return favorites.map((f) => f.favorite_id);
      const existing = new Set(prev);
      const next = favorites.filter((f) => existing.has(f.favorite_id)).map((f) => f.favorite_id);
      return next.length > 0 ? next : favorites.map((f) => f.favorite_id);
    });
  }, [favorites]);

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) setSelectedIds(favorites.map((f) => f.favorite_id));
      else setSelectedIds([]);
    },
    [favorites],
  );

  const toggleSelect = useCallback((favoriteId: number) => {
    setSelectedIds((prev) => (prev.includes(favoriteId) ? prev.filter((id) => id !== favoriteId) : [...prev, favoriteId]));
  }, []);

  const handleRemove = useCallback(
    async (favorite: FavoriteItem) => {
      await removeFavorite({
        productId: favorite.product.id,
        variantId: favorite.variant?.id ?? null,
      });
      setSelectedIds((prev) => prev.filter((id) => id !== favorite.favorite_id));
    },
    [removeFavorite],
  );

  const selectedFavorites = useMemo(
    () => favorites.filter((f) => selectedIds.includes(f.favorite_id)),
    [favorites, selectedIds],
  );

  const orderItems = useMemo(() => {
    if (!selectedFavorites.length) return [];
    return selectedFavorites.map((fav, index) => {
      const productName = resolveText(fav.product.name, lang) || mergedDict.fallbackProductName;
      const variantText = fav.variant
        ? fav.variant.label_text ?? resolveText(fav.variant.label, lang) ?? ""
        : "";
      const variantLabel = variantText ? ` (${variantText})` : "";
      const price = fav.variant?.price ?? fav.product.price ?? undefined;
      const priceFormatted = formatCurrency(price);
      const priceText = priceFormatted === "-" ? "-" : `${priceFormatted} ${mergedDict.priceUnit}`.trim();
      return { index: String(index + 1), productName, variantLabel, priceText };
    });
  }, [selectedFavorites, lang, mergedDict.fallbackProductName, mergedDict.priceUnit, formatCurrency]);

  const whatsappMessage = useMemo(() => {
    if (!orderItems.length) return mergedDict.whatsapp.emptyMessage;
    const lines = orderItems.map((item) =>
      formatTemplate(mergedDict.whatsapp.line, {
        index: item.index,
        product: item.productName,
        variant: item.variantLabel,
        price: item.priceText,
      }),
    );
    return `${mergedDict.whatsapp.intro}\n\n${lines.join("\n")}\n\n${mergedDict.whatsapp.outro}`;
  }, [orderItems, mergedDict.whatsapp]);

  const userName = useMemo(() => (user?.full_name ?? user?.name ?? "").trim(), [user?.full_name, user?.name]);
  const userEmail = useMemo(() => (user?.email ?? "").trim(), [user?.email]);
  const userWhatsapp = useMemo(() => (user?.whatsapp_e164 ?? user?.phone ?? "").trim(), [user?.whatsapp_e164, user?.phone]);

  const emailBody = useMemo(() => {
    if (!orderItems.length) return mergedDict.email.emptyMessage;
    const lines = orderItems.map((item) =>
      formatTemplate(mergedDict.email.line, {
        index: item.index,
        product: item.productName,
        variant: item.variantLabel,
        price: item.priceText,
      }),
    );
    const base = `${mergedDict.email.intro}\n\n${lines.join("\n")}\n\n${mergedDict.email.outro}`;
    const infoHeader = lang.startsWith("en") ? "Customer details" : "Detail pelanggan";
    const nameLabel = lang.startsWith("en") ? "Name" : "Nama";
    const emailLabel = "Email";
    const whatsappLabel = "WhatsApp";
    return `${base}\n\n${infoHeader}:\n${nameLabel}: ${userName || "-"}\n${emailLabel}: ${userEmail || "-"}\n${whatsappLabel}: ${userWhatsapp || "-"}`;
  }, [orderItems, mergedDict.email, userEmail, userName, userWhatsapp, lang]);

  const emailSuccessText = lang.startsWith("en")
    ? "Your request has been sent. We'll contact you via email."
    : "Permintaan Anda telah terkirim. Kami akan menghubungi Anda melalui email.";
  const emailGenericErrorText = lang.startsWith("en")
    ? "We could not send your request. Please try again."
    : "Kami tidak dapat mengirim permintaan Anda. Silakan coba lagi.";
  const emailMissingEmailText = lang.startsWith("en")
    ? "Please add your email address in profile before sending."
    : "Mohon lengkapi alamat email Anda di profil sebelum mengirim.";

  const handleCheckout = useCallback(async () => {
    if (!selectedFavorites.length) return;
    try {
      await checkout({ favorite_ids: selectedFavorites.map((i) => i.favorite_id) });
    } catch (error) {
      console.error("Checkout favorites failed", error);
    }
  }, [checkout, selectedFavorites]);

  const handleEmailOrder = useCallback(async () => {
    if (!selectedFavorites.length || !orderItems.length) return;
    if (!userEmail) {
      setEmailFeedback({ type: "error", message: emailMissingEmailText });
      return;
    }
    setIsSendingEmail(true);
    setEmailFeedback(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: userName || "Customer",
          email: userEmail,
          whatsapp: userWhatsapp,
          message: emailBody,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          (payload && typeof payload === "object" && "message" in payload && typeof (payload as any).message === "string" && (payload as any).message) ||
          emailGenericErrorText;
        throw new Error(message);
      }
      setEmailFeedback({ type: "success", message: emailSuccessText });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : emailGenericErrorText;
      setEmailFeedback({ type: "error", message });
    } finally {
      setIsSendingEmail(false);
    }
  }, [emailBody, emailGenericErrorText, emailMissingEmailText, emailSuccessText, orderItems.length, selectedFavorites.length, userEmail, userName, userWhatsapp]);

  // === Missing vars fixed here ===
  const hasFavorites = favorites.length > 0;
  const allSelected = hasFavorites && selectedIds.length === favorites.length;

  const whatsappHref = useMemo(() => {
    const raw = (CONTACT as any)?.whatsapp_e164 ?? (CONTACT as any)?.whatsapp ?? "";
    const number = typeof raw === "string" ? raw.replace(/[^\d]/g, "") : "";
    const base = number ? `https://wa.me/${number}` : "https://wa.me/";
    const url = `${base}?text=${encodeURIComponent(whatsappMessage)}`;
    return url;
  }, [whatsappMessage]);

  return (
    <Container className="py-12">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
          {mergedDict.pageTitle}
          <span className="mt-2 block text-sm font-normal text-neutral-600 sm:ml-3 sm:inline sm:text-base">
            {formatTemplate(mergedDict.pageTitleCount, {
              count: numberFormatter.format(favorites.length),
            })}
          </span>
        </h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="w-full rounded border border-neutral-200 bg-white lg:flex-1">
          <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
              {mergedDict.sectionTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 border-t border-neutral-200 px-6 py-4">
            <input
              type="checkbox"
              disabled={isLoading || !hasFavorites}
              checked={allSelected}
              onChange={(event) => toggleSelectAll(event.target.checked)}
              className="size-5 rounded border-neutral-300 text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
            />
            <span className="text-sm font-semibold text-neutral-900 sm:text-base">
              {mergedDict.selectAll}
            </span>
          </div>

          <div className="border-t border-neutral-200">
            {isLoading ? (
              <p className="px-6 py-10 text-sm text-neutral-500">{mergedDict.loading}</p>
            ) : !hasFavorites ? (
              <p className="px-6 py-10 text-sm text-neutral-500">{mergedDict.empty}</p>
            ) : (
              favorites.map((favorite, index) => {
                const productName = resolveText(favorite.product.name, lang) || mergedDict.fallbackProductName;
                const productCode = favorite.product?.slug ?? "";
                const variantLabelText =
                  favorite.variant?.label_text ?? resolveText(favorite.variant?.label ?? null, lang);
                const variantParts = variantLabelText
                  ? variantLabelText.split("|").map((part) => part.trim()).filter(Boolean)
                  : [];
                const price = favorite.variant?.price ?? favorite.product.price ?? null;

                const coverSrc =
                  (typeof favorite.product.cover_url === "string" && favorite.product.cover_url.length > 0
                    ? favorite.product.cover_url
                    : undefined) ??
                  (typeof favorite.product.cover === "string" && favorite.product.cover.length > 0
                    ? favorite.product.cover
                    : undefined) ??
                  FALLBACK_IMAGE;

                return (
                  <article
                    key={favorite.favorite_id}
                    className={clsx(
                      "flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:gap-6",
                      index > 0 && "border-t border-neutral-200",
                    )}
                  >
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(favorite.favorite_id)}
                        onChange={() => toggleSelect(favorite.favorite_id)}
                        className="mt-1 size-5 rounded border-neutral-300 text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:mt-0"
                      />
                      <div className="relative h-[6.25rem] w-[6.25rem] flex-shrink-0 overflow-hidden rounded bg-neutral-100 sm:h-[6.5rem] sm:w-[6.5rem]">
                        <Image src={coverSrc} alt={productName} fill className="object-cover" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div className="flex-1">
                        <p className="text-base font-semibold leading-snug text-neutral-900 line-clamp-2 sm:text-lg">
                          {productName}
                        </p>
                        {productCode ? (
                          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                            {productCode.toUpperCase()}
                          </p>
                        ) : null}
                        {variantParts.length ? (
                          <p className="mt-1 text-sm text-neutral-700 line-clamp-2">{variantParts.join(", ")}</p>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
                        <span className="text-sm font-semibold text-neutral-900 sm:text-base">
                          {price ? `${formatCurrency(price)} ${mergedDict.priceUnit}` : "-"}
                        </span>
                        <button
                          onClick={() => handleRemove(favorite)}
                          disabled={isRemoving}
                          className="inline-flex h-11 w-11 items-center justify-center rounded bg-red-600 text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={mergedDict.removeLabel}
                          type="button"
                        >
                          <FaTrash aria-hidden />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="w-full rounded border border-neutral-200 bg-white p-6 sm:p-7 lg:max-w-sm lg:flex-shrink-0">
          <p className="text-base font-semibold text-neutral-900">
            {formatTemplate(mergedDict.selectedCount, {
              count: numberFormatter.format(selectedFavorites.length),
            })}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={whatsappHref}
              onClick={(event) => {
                if (!selectedFavorites.length) {
                  event.preventDefault();
                  return;
                }
                handleCheckout();
              }}
              className={clsx(
                "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                !selectedFavorites.length && "pointer-events-none opacity-60",
              )}
              aria-disabled={!selectedFavorites.length}
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden />
              {isCheckingOut ? mergedDict.whatsapp.preparing : mergedDict.whatsapp.button}
            </a>

            <button
              type="button"
              onClick={handleEmailOrder}
              disabled={!selectedFavorites.length || isSendingEmail}
              className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded border border-primary px-5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaEnvelope aria-hidden />
              {isSendingEmail ? (locale.startsWith("en") ? "Sending..." : "Mengirim...") : mergedDict.email.button}
            </button>

            {emailFeedback ? (
              <p className={clsx("text-sm", emailFeedback.type === "success" ? "text-emerald-600" : "text-red-600")}>
                {emailFeedback.message}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </Container>
  );
};

export default Wishlist;
