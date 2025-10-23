import { apiFetch } from "@/lib/http";
import type { ApiResponse, ProductDetail } from "@/services/types";

export const ProductDetailService = {
  async findBySlug(slug: string, lang?: string) {
    const params = new URLSearchParams();
    if (lang) params.set("lang", lang);
    const path = `products/slug/${encodeURIComponent(slug)}${
      params.size ? `?${params.toString()}` : ""
    }`;

    const payload = await apiFetch<ApiResponse<ProductDetail>>(path);
    return payload?.data;
  },
};
