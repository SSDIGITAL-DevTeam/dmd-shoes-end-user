"use client";

import { useMemo, useState } from "react";

type CategoryRange = {
  id: number;
  name?: string | null;
  min?: number | null;
  max?: number | null;
};

type RangeValue = {
  min?: number | null;
  max?: number | null;
  categories?: CategoryRange[];
};

export type FilterValues = {
  heel_min?: number;
  heel_max?: number;
  size_min?: number;
  size_max?: number;
};

type FilterUkuranProps = {
  heel?: RangeValue;
  size?: RangeValue;
  values: FilterValues;
  onApply: (values: FilterValues) => void;
  onReset: () => void;
  fullWidth?: boolean;
  dictionary?: {
    trigger?: string;
    title?: string;
    close?: string;
    iconAlt?: string;
    heelTitle?: string;
    heelDefaultCategory?: string;
    heelRange?: string;
    sizeTitle?: string;
    sizeDefaultCategory?: string;
    sizeRange?: string;
    min?: string;
    max?: string;
    heelUnit?: string;
    sizeUnit?: string;
    reset?: string;
    apply?: string;
  };
  locale?: string;
};

const formatNumber = (value?: number | null, locale?: string) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  try {
    return new Intl.NumberFormat(locale ?? undefined, {
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return String(value);
  }
};

const formatRange = (min?: number | null, max?: number | null, locale?: string) =>
  `${formatNumber(min, locale)} - ${formatNumber(max, locale)}`;

const formatRangeValue = (range?: RangeValue, locale?: string) => {
  if (!range) return "-";
  const hasMin = range.min !== null && range.min !== undefined;
  const hasMax = range.max !== null && range.max !== undefined;
  if (hasMin || hasMax) return formatRange(range.min, range.max, locale);

  const mins: number[] = [];
  const maxs: number[] = [];
  (range.categories ?? []).forEach((c) => {
    if (c?.min !== null && c?.min !== undefined) mins.push(c.min);
    if (c?.max !== null && c?.max !== undefined) maxs.push(c.max);
  });
  if (!mins.length && !maxs.length) return "-";
  const minValue = mins.length ? Math.min(...mins) : undefined;
  const maxValue = maxs.length ? Math.max(...maxs) : undefined;
  return formatRange(minValue, maxValue, locale);
};

const applyTemplate = (template: string, replacements: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => replacements[key] ?? "");

const formatCategoryNames = (
  categories: CategoryRange[] | undefined,
  locale: string | undefined,
  fallback: string
) => {
  const names = (categories ?? [])
    .map((cat) => (cat?.name ?? "").trim())
    .filter((name): name is string => Boolean(name));
  if (!names.length) return fallback;
  if (typeof Intl !== "undefined" && typeof (Intl as any).ListFormat === "function") {
    try {
      const formatter = new (Intl as any).ListFormat(locale ?? undefined, {
        style: "short",
        type: "conjunction",
      });
      return formatter.format(names);
    } catch {
      return names.join(", ");
    }
  }
  return names.join(", ");
};

const buildTitleFromTemplate = (template: string, categoriesLabel: string) =>
  template.includes("{categories}")
    ? applyTemplate(template, { categories: categoriesLabel })
    : template;

/* ---------------------- Normalization helpers ---------------------- */

const toNumOrUndef = (raw: unknown): number | undefined => {
  if (raw === "" || raw === null || raw === undefined) return undefined;
  const num = Number(raw);
  return Number.isFinite(num) ? num : undefined;
};

const clamp = (v: number, min?: number | null, max?: number | null) => {
  let x = v;
  if (typeof min === "number") x = Math.max(x, min);
  if (typeof max === "number") x = Math.min(x, max);
  return x;
};

const normalizePair = (
  minIn: number | undefined,
  maxIn: number | undefined,
  fallbackMin: number // e.g. 0 for heel; or (heel?.min ?? 0)
): { min?: number; max?: number } => {
  let min = minIn;
  let max = maxIn;

  // Jika hanya max ada → isi min default
  if ((min === undefined || min === null) && (typeof max === "number")) {
    min = fallbackMin;
  }

  // Jika hanya min ada → biarkan; backend akan gunakan >= min
  // Jika dua-duanya ada & kebalik → tukar
  if (typeof min === "number" && typeof max === "number" && max < min) {
    [min, max] = [max, min];
  }

  return {
    min: typeof min === "number" ? min : undefined,
    max: typeof max === "number" ? max : undefined,
  };
};

export default function FilterUkuran({
  heel,
  size,
  values,
  onApply,
  onReset,
  fullWidth = true,
  dictionary,
  locale,
}: FilterUkuranProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterValues>(values);

  const isEnglish = (locale ?? "").startsWith("en");

  const labels = {
    trigger: dictionary?.trigger ?? (isEnglish ? "Size Filter" : "Filter Ukuran"),
    title: dictionary?.title ?? (isEnglish ? "Filter Size" : "Filter Ukuran"),
    close: dictionary?.close ?? (isEnglish ? "Close filter" : "Tutup filter"),
    iconAlt: dictionary?.iconAlt ?? (isEnglish ? "Size filter icon" : "Ikon filter ukuran"),
    heelTitleTemplate:
      dictionary?.heelTitle ?? (isEnglish ? "{categories} product sizes" : "Ukuran produk {categories}"),
    heelDefaultCategory: dictionary?.heelDefaultCategory ?? (isEnglish ? "Heel" : "Hak"),
    heelRange:
      dictionary?.heelRange ??
      (isEnglish ? "Available range: {range} ({unit})" : "Rentang tersedia: {range} ({unit})"),
    sizeTitleTemplate:
      dictionary?.sizeTitle ?? (isEnglish ? "Sizes for {categories}" : "Ukuran {categories}"),
    sizeDefaultCategory: dictionary?.sizeDefaultCategory ?? "Outsole & Wedges",
    sizeRange:
      dictionary?.sizeRange ??
      (isEnglish ? "Available range: {range} ({unit})" : "Rentang tersedia: {range} ({unit})"),
    min: dictionary?.min ?? (isEnglish ? "Min" : "Min"),
    max: dictionary?.max ?? (isEnglish ? "Max" : "Maks"),
    heelUnit: dictionary?.heelUnit ?? "cm",
    sizeUnit: dictionary?.sizeUnit ?? "EU",
    reset: dictionary?.reset ?? "Reset",
    apply: dictionary?.apply ?? (isEnglish ? "Apply" : "Terapkan"),
  };

  const heelSummary = useMemo(() => formatRangeValue(heel, locale), [heel, locale]);
  const sizeSummary = useMemo(() => formatRangeValue(size, locale), [size, locale]);

  const heelCategoryLabel = useMemo(
    () => formatCategoryNames(heel?.categories, locale, labels.heelDefaultCategory),
    [heel, locale, labels.heelDefaultCategory]
  );
  const heelCategoriesDetail = useMemo(
    () =>
      (heel?.categories ?? [])
        .map((category) => {
          if (!category) return null;
          const name = (category.name ?? "").trim() || labels.heelDefaultCategory;
          const rangeText = formatRange(category.min, category.max, locale);
          return { name, rangeText };
        })
        .filter((x): x is { name: string; rangeText: string } => x !== null),
    [heel?.categories, labels.heelDefaultCategory, locale]
  );

  const sizeCategoryLabel = useMemo(
    () => formatCategoryNames(size?.categories, locale, labels.sizeDefaultCategory),
    [size, locale, labels.sizeDefaultCategory]
  );
  const sizeCategoriesDetail = useMemo(
    () =>
      (size?.categories ?? [])
        .map((category) => {
          if (!category) return null;
          const name = (category.name ?? "").trim() || labels.sizeDefaultCategory;
          const rangeText = formatRange(category.min, category.max, locale);
          return { name, rangeText };
        })
        .filter((x): x is { name: string; rangeText: string } => x !== null),
    [size?.categories, labels.sizeDefaultCategory, locale]
  );

  const heelTitle = useMemo(
    () => buildTitleFromTemplate(labels.heelTitleTemplate, heelCategoryLabel),
    [labels.heelTitleTemplate, heelCategoryLabel]
  );
  const sizeTitle = useMemo(
    () => buildTitleFromTemplate(labels.sizeTitleTemplate, sizeCategoryLabel),
    [labels.sizeTitleTemplate, sizeCategoryLabel]
  );

  const heelRangeText = useMemo(
    () => applyTemplate(labels.heelRange, { range: heelSummary, unit: labels.heelUnit }),
    [heelSummary, labels.heelRange, labels.heelUnit]
  );
  const sizeRangeText = useMemo(
    () => applyTemplate(labels.sizeRange, { range: sizeSummary, unit: labels.sizeUnit }),
    [sizeSummary, labels.sizeRange, labels.sizeUnit]
  );

  const handleInput =
    (key: keyof FilterValues) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = toNumOrUndef(event.target.value);
        setDraft((prev) => ({
          ...prev,
          [key]: next,
        }));
      };

  const apply = () => {
    // Normalisasi HEEL
    const heelDefaultsMin = typeof heel?.min === "number" ? heel!.min! : 0; // default 0 cm
    let { min: hmin, max: hmax } = normalizePair(draft.heel_min, draft.heel_max, heelDefaultsMin);

    // Clamp ke meta range jika ada
    if (typeof hmin === "number") hmin = clamp(hmin, heel?.min ?? null, heel?.max ?? null);
    if (typeof hmax === "number") hmax = clamp(hmax, heel?.min ?? null, heel?.max ?? null);

    // Normalisasi SIZE
    const sizeDefaultsMin = typeof size?.min === "number" ? size!.min! : 0; // default 0 EU (boleh ubah ke 30/34 sesuai kebutuhan)
    let { min: smin, max: smax } = normalizePair(draft.size_min, draft.size_max, sizeDefaultsMin);

    if (typeof smin === "number") smin = clamp(smin, size?.min ?? null, size?.max ?? null);
    if (typeof smax === "number") smax = clamp(smax, size?.min ?? null, size?.max ?? null);

    const payload: FilterValues = {
      ...(typeof hmin === "number" ? { heel_min: hmin } : {}),
      ...(typeof hmax === "number" ? { heel_max: hmax } : {}),
      ...(typeof smin === "number" ? { size_min: smin } : {}),
      ...(typeof smax === "number" ? { size_max: smax } : {}),
    };

    onApply(payload);
    setOpen(false);
  };

  const reset = () => {
    setDraft({});
    onReset();
    setOpen(false);
  };

  const syncWithValues = () => setDraft(values);

  return (
    <div>
      <button
        onClick={() => {
          syncWithValues();
          setOpen(true);
        }}
        className={`inline-flex h-[40px] items-center justify-center gap-2
              rounded-lg border border-[#003663] bg-white px-3 text-sm
              text-[#003663] shadow-sm transition
              hover:border-[#002a4f] hover:text-[#002a4f]
              focus:outline-none focus:ring-2 focus:ring-[#003663]/30
              ${fullWidth ? "w-full" : "w-auto"}`}
      >
        {/* ikon mengikuti warna teks via CSS mask */}
        <span
          aria-hidden="true"
          className="inline-block h-4 w-4 bg-current text-current [mask:url(/assets/images/product/filter-ukuran.svg)_no-repeat_center/contain]"
        />
        <span className="leading-[150%]">{labels.trigger}</span>
      </button>

      {open ? <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} /> : null}

      <div
        className={`fixed top-0 right-0 h-full w-[320px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-b-gray-200">
          <h2 className="text-lg font-semibold text-[#003663]">{labels.title}</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-xl text-gray-500 hover:text-gray-700"
            aria-label={labels.close}
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-64px)] justify-between">
          <div className="space-y-6 overflow-y-auto px-4 py-6">
            <section className="space-y-4 border-b border-b-gray-200 pb-6">
              <header>
                <h3 className="font-medium text-[#121212]">{heelTitle}</h3>
                <p className="mt-2 text-sm text-[#121212]/60">{heelRangeText}</p>
              </header>

              {heelCategoriesDetail.length > 0 ? (
                <ul className="space-y-2 text-sm text-[#121212]/70">
                  {heelCategoriesDetail.map(({ name, rangeText }) => (
                    <li key={`heel-${name}`} className="flex items-center justify-between gap-4">
                      <span>{name}</span>
                      <span className="font-medium">{rangeText}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={draft.heel_min ?? ""}
                  onChange={handleInput("heel_min")}
                  placeholder={labels.min}
                  className="w-24 rounded-lg border px-2 py-1 text-[14px]"
                />
                <span className="text-sm text-[#121212]/60">{labels.heelUnit}</span>
                <div className="h-[1px] w-4 bg-[#121212]/60" />
                <input
                  type="number"
                  value={draft.heel_max ?? ""}
                  onChange={handleInput("heel_max")}
                  placeholder={labels.max}
                  className="w-24 rounded-lg border px-2 py-1 text-[14px]"
                />
                <span className="text-sm text-[#121212]/60">{labels.heelUnit}</span>
              </div>
            </section>

            <section className="space-y-4">
              <header>
                <h3 className="font-medium text-[#121212]">{sizeTitle}</h3>
                <p className="mt-2 text-sm text-[#121212]/60">{sizeRangeText}</p>
              </header>

              {sizeCategoriesDetail.length > 0 ? (
                <ul className="space-y-2 text-sm text-[#121212]/70">
                  {sizeCategoriesDetail.map(({ name, rangeText }) => (
                    <li key={`size-${name}`} className="flex items-center justify-between gap-4">
                      <span>{name}</span>
                      <span className="font-medium">{rangeText}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={draft.size_min ?? ""}
                  onChange={handleInput("size_min")}
                  placeholder={labels.min}
                  className="w-24 rounded-lg border px-2 py-1 text-[14px]"
                />
                <span className="text-sm text-[#121212]/60">{labels.sizeUnit}</span>
                <div className="h-[1px] w-4 bg-[#121212]/60" />
                <input
                  type="number"
                  value={draft.size_max ?? ""}
                  onChange={handleInput("size_max")}
                  placeholder={labels.max}
                  className="w-24 rounded-lg border px-2 py-1 text-[14px]"
                />
                <span className="text-sm text-[#121212]/60">{labels.sizeUnit}</span>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between border-t border-t-gray-200 p-4">
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-[#003663] hover:underline"
            >
              {labels.reset}
            </button>
            <button
              type="button"
              onClick={apply}
              className="rounded-lg bg-[#003663] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002a4f]"
            >
              {labels.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
