export type ApiStatus = "success" | "error" | "ok" | boolean;

export type ApiResponse<T> = {
  status: ApiStatus;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: PaginationMeta;
  [key: string]: unknown;
};

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
  [key: string]: unknown;
};

export type Pagination<T> = PaginationMeta & {
  data: T[];
};

export type MultiLangValue = Record<string, string | null | undefined>;

export type ProductGalleryImage = {
  id: number;
  url: string;
  title?: string | null;
  title_text?: string | null;
  alt?: string | null;
  alt_text?: string | null;
  sort?: number | null;
};

export type ProductVariant = {
  id: number;
  label: string;
  label_text?: string | null;
  price?: number | null;
  price_min?: number | null;
  stock?: number | null;
  active?: boolean;
};

export type ProductAttributeOption = {
  id: number;
  value: string;
  value_text?: string | null;
  sort?: number | null;
};

export type ProductAttribute = {
  id: number;
  name: MultiLangValue | string;
  name_text?: string | null;
  sort?: number | null;
  options: ProductAttributeOption[];
};

export type ProductCard = {
  id: number;
  slug: string;
  name?: MultiLangValue;
  name_text?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  price?: number | null;
  variants_min_price?: number | null;
  category_id?: number | null;
  category_name?: string | null;
  featured?: boolean;
  favorites_count?: number | null;
  pricing_mode?: string | null;
  heel_height_cm?: number | null;
  size_eu?: number | null;
  size_eu_min?: number | null;
  size_eu_max?: number | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ProductDetail = ProductCard & {
  description?: MultiLangValue;
  description_text?: string | null;
  gallery?: ProductGalleryImage[];
  attributes_data?: ProductAttribute[];
  variants_data?: ProductVariant[];
  seo?: {
    tags?: string[];
    keyword?: string | null;
    description?: string | null;
    [key: string]: unknown;
  };
};

export type CategoryBrief = {
  id: number;
  slug: string;
  name?: string | null;
};

export type Category = {
  id: number;
  slug: string;
  name?: MultiLangValue;
  name_text?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  status?: boolean;
  parent_id?: number | null;
  parent_brief?: CategoryBrief | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type Article = {
  id: number;
  title: MultiLangValue;
  title_text?: string | null;
  slug?: string;
  excerpt?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  author_name?: string | null;
  content?: MultiLangValue;
  content_text?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type HomepageHero = {
  title?: string | null;
  subtitle?: string | null;
  image_url?: string | null;
  image?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  link?: string | null;
};

export type HomepageVideo = {
  mode?: string | null;
  url?: string | null;
  file_url?: string | null;
  file?: string | null;
  cover_url?: string | null;
};

export type HomepageSlider = {
  id: number;
  image_url: string;
  image?: string | null;
  link_url?: string | null;
  sort?: number | null;
};

export type HomepageContent = {
  id?: number;
  hero?: HomepageHero;
  video?: HomepageVideo;
  sliders?: Record<string, HomepageSlider[]>;
};

export type FavoriteItem = {
  favorite_id: number;
  product: {
    id: number;
    name: MultiLangValue | string | null;
    slug?: string | null;
    price?: number | null;
    status?: boolean;
  };
  variant: {
    id: number;
    label: string;
    price?: number | null;
    stock?: number | null;
    active?: boolean;
  } | null;
  added_at?: string | null;
};

export type FavoriteCheckoutPayload = {
  favorite_ids?: number[];
  items?: {
    product_id: number;
    variant_id?: number;
    qty: number;
  }[];
  note?: string;
};

export type FavoriteCheckoutResponse = {
  status: ApiStatus;
  count: number;
  whatsapp_url?: string;
  preview_message?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status?: boolean;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MetaPage = {
  id: number;
  name: string;
  slug: string;
};

export type MetaTag = {
  id: number;
  page_id: number;
  locale: string;
  key: string;
  value: string;
  content: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MetaKeyValue = Record<string, string>;

export type Credentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};
