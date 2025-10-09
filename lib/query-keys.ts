export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  homepage: ["homepage"] as const,
  products: {
    root: ["products"] as const,
    list: (params?: Record<string, unknown>) => ["products", "list", params ?? {}] as const,
    detail: (slug: string, lang?: string) =>
      ["products", "detail", slug, lang ?? ""] as const,
    filters: (params?: Record<string, unknown>) => ["products", "filters", params ?? {}] as const,
  },
  categories: {
    list: (params?: Record<string, unknown>) => ["categories", "list", params ?? {}] as const,
  },
  articles: {
    list: (params?: Record<string, unknown>) => ["articles", "list", params ?? {}] as const,
  },
  favorites: {
    list: ["favorites", "list"] as const,
  },
  meta: {
    pages: ["meta", "pages"] as const,
    pageTags: (page: string | number, locale?: string) =>
      ["meta", "page-tags", page, locale ?? ""] as const,
    allKeyValue: (page: string | number, locale?: string) =>
      ["meta", "page-tags", "all", page, locale ?? ""] as const,
    publicBySlug: (slug: string, locale?: string) =>
      ["meta", "public", slug, locale ?? ""] as const,
  },
} as const;

export type QueryKey =
  | typeof queryKeys.auth.me
  | typeof queryKeys.homepage
  | ReturnType<typeof queryKeys.products.list>
  | ReturnType<typeof queryKeys.products.detail>
  | ReturnType<typeof queryKeys.products.filters>
  | ReturnType<typeof queryKeys.categories.list>
  | ReturnType<typeof queryKeys.articles.list>
  | typeof queryKeys.favorites.list
  | typeof queryKeys.meta.pages
  | ReturnType<typeof queryKeys.meta.pageTags>
  | ReturnType<typeof queryKeys.meta.allKeyValue>
  | ReturnType<typeof queryKeys.meta.publicBySlug>;
