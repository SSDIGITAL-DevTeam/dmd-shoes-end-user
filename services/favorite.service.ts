import { apiFetch, buildQueryString, withAuth } from "@/lib/api-client";
import type {
  ApiResponse,
  FavoriteCheckoutPayload,
  FavoriteCheckoutResponse,
  FavoriteItem,
} from "@/services/types";

type FavoriteListResponse = ApiResponse<FavoriteItem[]>;

const list = async (): Promise<FavoriteItem[]> => {
  const response = await apiFetch<FavoriteListResponse>("/favorites", {
    method: "GET",
    ...withAuth(),
  });
  return Array.isArray(response.data) ? response.data : [];
};

const add = async (productId: number, variantId?: number | null) => {
  const body = variantId ? { variant_id: variantId } : undefined;
  return apiFetch<ApiResponse<{ favorite_id: number }>>(
    `/favorites/${productId}`,
    {
      method: "POST",
      body,
      ...withAuth(),
    },
  );
};

const remove = async (productId: number, variantId?: number | null) => {
  const query = buildQueryString({ variant_id: variantId });
  return apiFetch<ApiResponse<{ removed?: number }>>(
    `/favorites/${productId}${query}`,
    {
      method: "DELETE",
      ...withAuth(),
    },
  );
};

const checkout = async (
  payload?: FavoriteCheckoutPayload,
): Promise<FavoriteCheckoutResponse> => {
  const body: Record<string, unknown> | undefined = payload
    ? {
        favorite_ids: payload.favorite_ids,
        note: payload.note,
      }
    : undefined;

  const response = await apiFetch<
    FavoriteCheckoutResponse & ApiResponse<unknown>
  >("/favorites/checkout", {
    method: "POST",
    body,
    ...withAuth(),
  });

  return {
    status: response.status ?? "success",
    count: response.count ?? 0,
    whatsapp_url:
      "whatsapp_url" in response ? (response.whatsapp_url as string | undefined) : undefined,
    preview_message:
      "preview_message" in response
        ? (response.preview_message as string | undefined)
        : undefined,
  };
};

export const FavoriteService = {
  list,
  add,
  remove,
  checkout,
};

export type FavoriteServiceType = typeof FavoriteService;
