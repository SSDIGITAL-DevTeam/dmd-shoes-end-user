import { API_URL } from "@/lib/env";
import type { ApiResponse, ProductDetail } from "@/services/types";

export const ProductDetailService = {
  async findBySlug(slug: string, lang?: string) {
    const params = new URLSearchParams();
    if (lang) params.set("lang", lang);
    const url = `${API_URL}/products/slug/${encodeURIComponent(slug)}${
      params.size ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product detail (${response.status})`);
    }

    const payload = (await response.json()) as ApiResponse<ProductDetail>;
    return payload.data;
  },
};
