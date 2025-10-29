"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import Container from "@/components/ui-custom/Container";
import ProductChoice from "./ProductChoice";
import ButtonWishlist from "./ButtonWishlist";
import ProductItem from "@/components/demo/product/ProductItem";
import type { ProductCard, ProductDetail, ProductVariant } from "@/services/types";
import { CONTACT } from "@/config/contact";
import { inter } from "@/config/font";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

type ProductSlugPageProps = {
  lang: string;
  dictionaryProduct: any;
  product: ProductDetail;
  related: ProductCard[];
};

type PreviewImage = {
  id: string;
  url: string;
  alt: string;
  title?: string | null;
};

type PendingFavorite = {
  productId: number;
  variantId?: number | null;
  selections?: Record<string, string>;
  lang?: string;
  callbackUrl?: string;
  createdAt?: number;
};

type ProductAttributeChoice = {
  label: string;
  options: string[];
};

// ==== Types to prevent never[] on attributes/options ====
type AttrOption = {
  id?: string | number;
  value?: string | Record<string, string | undefined>;
  value_text?: string;
};

type AttrData = {
  name_text?: string;
  name?: string | Record<string, string | undefined>;
  options?: AttrOption[];
};

const FALLBACK_IMAGE = "/assets/demo/demo-product.png";
const PENDING_WISHLIST_KEY = "pending_wishlist";
const PENDING_WISHLIST_TTL = 15 * 60 * 1000;

const formatCurrency = (value: number, lang: string) => {
  const locale = lang.startsWith("en") ? "en-US" : "id-ID";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatTemplate = (template: string, replacements: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? "");

const normalizeLabel = (value?: string | null) =>
  (value ?? "").toString().trim();

const extractVariantTokens = (variant: ProductVariant): string[] => {
  const tokens = new Set<string>();

  const pushTokensFromValue = (value: unknown) => {
    if (!value) return;
    if (typeof value === "string") {
      value
        .split("|")
        .map((part) => part.split(":").pop() ?? part)
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean)
        .forEach((token) => tokens.add(token));
      return;
    }

    if (typeof value === "object") {
      Object.values(value as Record<string, unknown>).forEach((inner) =>
        pushTokensFromValue(inner),
      );
    }
  };

  pushTokensFromValue(variant.label_text);
  pushTokensFromValue(variant.label);

  return Array.from(tokens);
};

const ensurePreviewImages = (
  product: ProductDetail,
  fallbackName: string,
): PreviewImage[] => {
  const gallery = (product.gallery ?? [])
    .filter((item) => item?.url)
    .map((item, index) => {
      const id = typeof item?.id === "number" ? item.id : index;
      const url = item?.url ?? "";
      const alt =
        item?.alt_text ??
        item?.alt ??
        item?.title_text ??
        item?.title ??
        fallbackName ??
        "Product image";
      const title = item?.title_text ?? item?.title ?? null;
      return {
        id: String(id),
        url,
        alt,
        title,
      };
    });

  if (gallery.length > 0) {
    return gallery;
  }

  if (product.cover_url) {
    return [
      {
        id: String(product.id ?? "cover"),
        url: product.cover_url,
        alt: fallbackName ?? "Product image",
        title: fallbackName ?? null,
      },
    ];
  }

  return [
    {
      id: "fallback",
      url: FALLBACK_IMAGE,
      alt: fallbackName ?? "Product image",
      title: fallbackName ?? null,
    },
  ];
};

const mapAttributes = (
  product: ProductDetail,
  lang: string,
  fallbackName: string,
): ProductAttributeChoice[] =>
  ((product.attributes_data ?? []) as AttrData[]).map((attribute, index) => {
    const fallbackLabel =
      (lang.startsWith("en") ? "Option" : "Pilihan") + ` ${index + 1}`;

    const label =
      attribute?.name_text ??
      (typeof attribute?.name === "string"
        ? attribute.name
        : (attribute?.name as Record<string, string | undefined>)?.[lang] ??
        (attribute?.name as Record<string, string | undefined>)?.id ??
        fallbackLabel) ??
      fallbackLabel;

    const options = (attribute?.options ?? ([] as AttrOption[]))
      .map((option: AttrOption) => {
        const labelText =
          option?.value_text ??
          (typeof option?.value === "string"
            ? option.value
            : (option?.value as Record<string, string | undefined>)?.[lang] ??
            (option?.value as Record<string, string | undefined>)?.id ??
            (option?.id !== undefined ? String(option.id) : ""));
        return normalizeLabel(labelText);
      })
      .filter(Boolean);

    return { label: normalizeLabel(label), options };
  });

export default function ProductSlugPage({
  lang,
  dictionaryProduct,
  product,
  related,
}: ProductSlugPageProps) {
  const detailDict = dictionaryProduct?.detail ?? {};
  const contactLabels = detailDict.contact ?? {};
  const wishlistLabels = detailDict.wishlist ?? {};
  const relatedProducts = useMemo<ProductCard[]>(
    () =>
      (Array.isArray(related) ? related : [])
        .filter((item): item is ProductCard => !!item)
        .slice(0, 4),
    [related],
  );

  const { isAuthed, isReady } = useAuth();
  const { addFavorite, isAdding } = useFavorites();
  useEffect(() => {
    console.log("useAuth status", { isAuthed, isReady });
  }, [isAuthed, isReady]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = useMemo(() => {
    const qs = searchParams ? searchParams.toString() : "";
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  const fallbackName =
    product.name_text ??
    (typeof product.name === "string"
      ? product.name
      : product.name?.[lang] ??
      product.name?.id ??
      product.slug ??
      "Product");

  const breadcrumbProducts =
    detailDict.breadcrumbProducts ??
    (lang.startsWith("en") ? "Products" : "Produk");
  const categoryLabel =
    detailDict.category ?? (lang.startsWith("en") ? "Category" : "Kategori");
  const descriptionLabel =
    detailDict.description ??
    (lang.startsWith("en") ? "Description" : "Deskripsi");
  const priceLabel =
    detailDict.price ?? (lang.startsWith("en") ? "Price" : "Harga");
  const priceNote =
    detailDict.priceNote ??
    (lang.startsWith("en")
      ? "Price excludes shipping"
      : "Harga belum termasuk ongkir");
  const priceSuffix =
    detailDict.priceSuffix ??
    (lang.startsWith("en") ? "per pair" : "per pasang");
  const attributesTitle =
    detailDict.attributes ??
    (lang.startsWith("en") ? "Available Options" : "Pilihan yang tersedia");

  const previews = useMemo(
    () => ensurePreviewImages(product, fallbackName),
    [product, fallbackName],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const safePreviews =
    previews.length > 0
      ? previews
      : [
        {
          id: "fallback",
          url: FALLBACK_IMAGE,
          alt: fallbackName,
          title: fallbackName,
        },
      ];
  const previewRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    previewRefs.current = previewRefs.current.slice(0, safePreviews.length);
  }, [safePreviews.length]);

  const showPreviewNav = safePreviews.length > 4;

  const handlePreviewPrev = useCallback(() => {
    if (safePreviews.length <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? safePreviews.length - 1 : prev - 1));
  }, [safePreviews.length]);

  const handlePreviewNext = useCallback(() => {
    if (safePreviews.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % safePreviews.length);
  }, [safePreviews.length]);

  useEffect(() => {
    const node = previewRefs.current[activeIndex];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex, safePreviews.length]);

  const activePreview = safePreviews[activeIndex] ?? safePreviews[0];

  const attributes = useMemo<ProductAttributeChoice[]>(
    () => mapAttributes(product, lang, fallbackName),
    [product, lang, fallbackName],
  );

  const attributeSummaries = useMemo(
    () =>
      attributes
        .filter((attribute) => attribute.options.length > 0)
        .map((attribute) => {
          const uniqueOptions = Array.from(
            new Set(
              attribute.options
                .map((option) => option.trim())
                .filter(Boolean),
            ),
          );

          return {
            label: attribute.label,
            options: uniqueOptions.join(", "),
          };
        })
        .filter((summary) => summary.options.length > 0),
    [attributes],
  );

  const requiredAttributes = useMemo(
    () => attributes.filter((attribute) => attribute.options.length > 0),
    [attributes],
  );

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {},
  );

  const selectedVariant = useMemo(() => {
    const variantData = product.variants_data ?? [];
    if (variantData.length === 0) {
      return null;
    }

    const normalizedSelections = requiredAttributes
      .map((attribute) => selectedOptions[attribute.label])
      .filter((value): value is string => Boolean(value && value.trim()))
      .map((value) => value.toLowerCase().trim());

    if (
      normalizedSelections.length === 0 ||
      normalizedSelections.length !== requiredAttributes.length
    ) {
      return null;
    }

    return (
      variantData.find((variant) => {
        const tokens = extractVariantTokens(variant);
        if (!tokens.length) return false;
        return normalizedSelections.every((selection) =>
          tokens.some((token) => token.includes(selection)),
        );
      }) ?? null
    );
  }, [product.variants_data, requiredAttributes, selectedOptions]);

  const resolvedPriceValue =
    product.pricing_mode === "per_variant"
      ? typeof selectedVariant?.price === "number"
        ? selectedVariant.price
        : null
      : [product.price, product.price_min, product.variants_min_price].find(
        (value): value is number => typeof value === "number",
      ) ?? null;

  const displayPrice =
    typeof resolvedPriceValue === "number"
      ? formatCurrency(resolvedPriceValue, lang)
      : null;

  const variantPricePrompt =
    product.pricing_mode === "per_variant" && !displayPrice
      ? detailDict.variantPricePrompt ??
        (lang.startsWith("en")
          ? "Select a variant to see the price."
          : "Pilih varian untuk melihat harga.")
      : null;
  const sanitizedWhatsappNumber = useMemo(
    () => CONTACT.whatsapp.replace(/\D/g, ""),
    [],
  );
  const selectedOptionEntries = useMemo(
    () =>
      Object.entries(selectedOptions)
        .map(
          ([label, value]) =>
            [label, normalizeLabel(value)] as [string, string],
        )
        .filter(([, value]) => Boolean(value)),
    [selectedOptions],
  );
  const selectedVariantLabel = useMemo(() => {
    if (!selectedVariant) return null;

    const directLabel = normalizeLabel(selectedVariant.label_text);
    if (directLabel) return directLabel;

    if (typeof selectedVariant.label === "string") {
      const label = normalizeLabel(selectedVariant.label);
      if (label) return label;
    } else if (selectedVariant.label) {
      const labelByLang = normalizeLabel(
        (selectedVariant.label as Record<string, string | undefined>)?.[lang],
      );
      if (labelByLang) return labelByLang;

      const fallback = normalizeLabel(
        (selectedVariant.label as Record<string, string | undefined>)?.id,
      );
      if (fallback) return fallback;
    }

    return null;
  }, [selectedVariant, lang]);

  const selectedPriceValue =
    typeof selectedVariant?.price === "number"
      ? selectedVariant.price
      : resolvedPriceValue;
  const formattedSelectedPrice =
    typeof selectedPriceValue === "number"
      ? formatCurrency(selectedPriceValue, lang)
      : displayPrice;
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${currentUrl}`;
    }
    return currentUrl;
  }, [currentUrl]);
  const shareIntro = lang.startsWith("en")
    ? "Hello, I'm interested in this product:"
    : "Halo, saya tertarik dengan produk berikut:";
  const shareText = useMemo(() => {
    const lines: string[] = [shareIntro];
    const productLabel = lang.startsWith("en") ? "Product" : "Produk";
    lines.push(`${productLabel}: ${fallbackName}`);

    if (selectedVariantLabel) {
      const variantLabel = lang.startsWith("en") ? "Variant" : "Varian";
      lines.push(`${variantLabel}: ${selectedVariantLabel}`);
    }

    if (selectedOptionEntries.length > 0) {
      lines.push(
        lang.startsWith("en") ? "Selected options:" : "Pilihan yang dipilih:",
      );
      selectedOptionEntries.forEach(([label, value]) => {
        lines.push(`- ${label}: ${value}`);
      });
    }

    if (formattedSelectedPrice) {
      lines.push(
        `${priceLabel}: ${formattedSelectedPrice}${
          priceSuffix ? ` (${priceSuffix})` : ""
        }`,
      );
    }

    if (shareUrl) {
      const linkLabel = lang.startsWith("en") ? "Link" : "Tautan";
      lines.push(`${linkLabel}: ${shareUrl}`);
    }

    return lines.join("\n");
  }, [
    fallbackName,
    formattedSelectedPrice,
    lang,
    priceLabel,
    priceSuffix,
    selectedOptionEntries,
    selectedVariantLabel,
    shareIntro,
    shareUrl,
  ]);

  const shareSubject = useMemo(
    () =>
      lang.startsWith("en")
        ? `Inquiry about ${fallbackName}`
        : `Tanya produk ${fallbackName}`,
    [fallbackName, lang],
  );

  const whatsappHref = useMemo(() => {
    const message = encodeURIComponent(shareText);
    return `https://wa.me/${sanitizedWhatsappNumber}?text=${message}`;
  }, [sanitizedWhatsappNumber, shareText]);

  const emailHref = useMemo(() => {
    const subject = encodeURIComponent(shareSubject);
    const body = encodeURIComponent(shareText);
    return `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  }, [shareSubject, shareText]);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const encodedCallback = encodeURIComponent(currentUrl);
  const loginHref = `/${lang}/auth/login?callbackUrl=${encodedCallback}`;
  const registerHref = `/${lang}/auth/register?callbackUrl=${encodedCallback}`;

  const selectTemplate =
    wishlistLabels.selectOptions ??
    (lang.startsWith("en")
      ? "Please select {label} before adding to favorites."
      : "Silakan pilih {label} terlebih dahulu.");
  const successMessage =
    wishlistLabels.success ??
    (lang.startsWith("en")
      ? "Product added to your favorites."
      : "Produk berhasil ditambahkan ke favorit.");
  const errorMessage =
    wishlistLabels.error ??
    (lang.startsWith("en")
      ? "Unable to add this product to favorites. Please try again."
      : "Gagal menambahkan ke favorit. Silakan coba lagi.");
  const checkingSessionMessage =
    wishlistLabels.checkingSession ??
    (lang.startsWith("en")
      ? "Checking your session, please wait."
      : "Memeriksa sesi Anda, mohon tunggu.");
  const variantMissingMessage = lang.startsWith("en")
    ? "Variant not available for the selected options."
    : "Varian tidak tersedia untuk pilihan ini.";

  const handleOptionSelect = useCallback((label: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [label]: value,
    }));
    setStatusMessage(null);
  }, []);

  const clearPendingFavorite = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PENDING_WISHLIST_KEY);
    }
    setLoginPromptOpen(false);
  }, []);

  const handleAddToWishlist = useCallback(async () => {
    setStatusMessage(null);
    console.log("handleAddToWishlist auth state", { isAuthed, isReady });

    if (!isReady) {
      setStatusMessage({ type: "info", text: checkingSessionMessage });
      return;
    }

    for (const attribute of requiredAttributes) {
      const selection = selectedOptions[attribute.label];
      if (!selection) {
        const message = formatTemplate(selectTemplate, { label: attribute.label });
        setStatusMessage({ type: "error", text: message });
        return;
      }
    }

    const variantData = product.variants_data ?? [];
    let matchedVariantId: number | undefined =
      typeof selectedVariant?.id === "number" ? selectedVariant.id : undefined;

    if (variantData.length > 0 && requiredAttributes.length > 0) {
      if (!matchedVariantId) {
        setStatusMessage({ type: "error", text: variantMissingMessage });
        return;
      }
    }

    // âœ… gunakan isAuthed dari hook yang dipanggil di top-level komponen
    if (!isAuthed) {
      if (typeof window !== "undefined") {
        const pending: PendingFavorite = {
          productId: product.id,
          variantId: matchedVariantId ?? null,
          selections: selectedOptions,
          lang,
          callbackUrl: currentUrl,
          createdAt: Date.now(),
        };
        window.localStorage.setItem(PENDING_WISHLIST_KEY, JSON.stringify(pending));
      }
      setLoginPromptOpen(true);
      return;
    }

    try {
      await addFavorite({ productId: product.id, variantId: matchedVariantId ?? undefined });
      setStatusMessage({ type: "success", text: successMessage });
    } catch (error) {
      console.error("Failed to add favorite", error);
      setStatusMessage({ type: "error", text: errorMessage });
    }
  }, [
    addFavorite,
    checkingSessionMessage,
    currentUrl,
    errorMessage,
    isAuthed,
    isReady,
    lang,
    product.id,
    product.variants_data,
    requiredAttributes,
    selectTemplate,
    selectedOptions,
    selectedVariant,
    successMessage,
    variantMissingMessage,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(PENDING_WISHLIST_KEY);
    if (!raw) return;

    try {
      const pending: PendingFavorite = JSON.parse(raw);
      const isExpired =
        typeof pending?.createdAt === "number"
          ? Date.now() - pending.createdAt > PENDING_WISHLIST_TTL
          : false;

      if (isExpired) {
        window.localStorage.removeItem(PENDING_WISHLIST_KEY);
        return;
      }

      if (pending?.productId === product.id && pending?.selections) {
        setSelectedOptions((prev) =>
          Object.keys(prev).length > 0 ? prev : pending.selections ?? {},
        );
      }
    } catch (error) {
      console.error("Failed to read pending wishlist", error);
      window.localStorage.removeItem(PENDING_WISHLIST_KEY);
    }
  }, [product.id]);

  useEffect(() => {
    if (typeof window === "undefined" || !isReady || !isAuthed || isAdding) return;

    const raw = window.localStorage.getItem(PENDING_WISHLIST_KEY);
    if (!raw) return;

    try {
      const pending: PendingFavorite = JSON.parse(raw);
      if (pending?.productId !== product.id) {
        return;
      }

      const isExpired =
        typeof pending?.createdAt === "number"
          ? Date.now() - pending.createdAt > PENDING_WISHLIST_TTL
          : false;

      if (isExpired) {
        window.localStorage.removeItem(PENDING_WISHLIST_KEY);
        return;
      }

      const selections = pending.selections ?? {};
      if (Object.keys(selections).length > 0) {
        setSelectedOptions((prev) =>
          Object.keys(prev).length > 0 ? prev : selections,
        );
      }

      setLoginPromptOpen(false);
      setStatusMessage(null);

      const variantId =
        typeof pending.variantId === "number" ? pending.variantId : undefined;

      const resume = async () => {
        try {
          await addFavorite({
            productId: pending.productId,
            variantId,
          });
          setStatusMessage({ type: "success", text: successMessage });
        } catch (error) {
          console.error("Failed to resume pending favorite", error);
          setStatusMessage({ type: "error", text: errorMessage });
        } finally {
          clearPendingFavorite();
        }
      };

      void resume();
    } catch (error) {
      console.error("Failed to parse pending wishlist entry", error);
      window.localStorage.removeItem(PENDING_WISHLIST_KEY);
    }
  }, [
    addFavorite,
    clearPendingFavorite,
    errorMessage,
    isAdding,
    isAuthed,
    isReady,
    product.id,
    successMessage,
  ]);

  return (
    <Container className={`${inter.className} py-10`}>
      <nav className="mb-6 text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={`/${lang}/product`}
              className="text-primary hover:underline"
            >
              {breadcrumbProducts}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{fallbackName}</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white"
            style={{ maxWidth: "min(100%, 725px)" }}
          >
            <Image
              src={activePreview.url || FALLBACK_IMAGE}
              alt={activePreview.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 725px"
              className="object-cover"
              priority
            />
          </div>

          {safePreviews.length > 1 ? (
            <div className="relative mt-2 flex items-center gap-2">
              {showPreviewNav ? (
                <button
                  type="button"
                  onClick={handlePreviewPrev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={lang.startsWith("en") ? "Previous image" : "Gambar sebelumnya"}
                >
                  <FaChevronLeft />
                </button>
              ) : null}
              <div className="flex gap-3 overflow-x-auto scroll-smooth py-1">
                {safePreviews.map((preview, index) => (
                  <button
                    key={preview.id}
                    ref={(node) => {
                      previewRefs.current[index] = node;
                    }}
                    onClick={() => setActiveIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition ${activeIndex === index
                      ? "border-primary"
                      : "border-gray-200 hover:border-primary"
                      }`}
                    type="button"
                    aria-label={preview.title ?? preview.alt}
                  >
                    <Image
                      src={preview.url || FALLBACK_IMAGE}
                      alt={preview.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              {showPreviewNav ? (
                <button
                  type="button"
                  onClick={handlePreviewNext}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={lang.startsWith("en") ? "Next image" : "Gambar berikutnya"}
                >
                  <FaChevronRight />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-[#003663]">
              {fallbackName}
            </h1>
            <div className="space-y-1 text-sm text-gray-600">
              {product.category_name ? (
                <p>
                  <span className="font-semibold text-gray-700">
                    {categoryLabel}:
                  </span>{" "}
                  {product.category_name}
                </p>
              ) : null}
              {attributeSummaries.map(({ label, options }) => (
                <p key={label}>
                  <span className="font-semibold text-gray-700">
                    {label}:
                  </span>{" "}
                  {options}
                </p>
              ))}
              {typeof product.favorites_count === "number" ? (
                <p className="text-xs text-gray-500">
                  {product.favorites_count}{" "}
                  {lang.startsWith("en") ? "favorites" : "favorit"}
                </p>
              ) : null}
            </div>
          </header>

          {displayPrice || variantPricePrompt ? (
            <div className="space-y-1">
              <div className="text-sm font-semibold uppercase text-primary">
                {priceLabel}
              </div>
              {displayPrice ? (
                <div className="text-3xl font-bold text-[#121212]">
                  {displayPrice}{" "}
                  <span className="text-base font-medium text-gray-500">
                    {priceSuffix}
                  </span>
                </div>
              ) : variantPricePrompt ? (
                <p className="text-sm text-[#D97706]">{variantPricePrompt}</p>
              ) : null}
              {displayPrice && priceNote ? (
                <p className="text-sm text-[#D97706]">{priceNote}</p>
              ) : null}
            </div>
          ) : null}

          {product.description_text ? (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-[#003663]">
                {descriptionLabel}
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {product.description_text}
              </p>
            </section>
          ) : null}

          {attributes.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[#003663]">
                {attributesTitle}
              </h2>
              {attributes.map(({ label, options }) => (
                <ProductChoice
                  key={label}
                  label={label}
                  options={options}
                  value={selectedOptions[label] ?? ""}
                  onSelect={(value) => handleOptionSelect(label, value)}
                />
              ))}
            </section>
          ) : null}

          <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-row">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 lg:w-auto"
            >
              <FaWhatsapp size={22} aria-hidden="true" />
            </Link>

            <Link
              href={emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-[#04264b] lg:w-auto"
            >
              <CiMail size={22} aria-hidden="true" />
            </Link>

            <div className="col-span-2 w-full">
              <ButtonWishlist
              labels={wishlistLabels}
              onClick={handleAddToWishlist}
              disabled={isAdding}
              isLoading={isAdding}
              isLoginPromptOpen={loginPromptOpen}
              onCloseLoginPrompt={clearPendingFavorite}
              loginHref={loginHref}
              registerHref={registerHref}
            />
            </div>
          </div>

          {statusMessage ? (
            <p
              className={`text-sm ${statusMessage.type === "error"
                ? "text-red-600"
                : statusMessage.type === "success"
                  ? "text-green-600"
                  : "text-blue-600"
                }`}
            >
              {statusMessage.text}
            </p>
          ) : null}
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-16 space-y-6">
          <h2 className="text-xl font-semibold text-[#003663]">
            {detailDict.related ??
              (lang.startsWith("en")
                ? "You may also like"
                : "Anda mungkin juga menyukainya")}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((item: ProductCard) => (
              <ProductItem key={item.id} product={item} locale={lang} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
