import { ApiError, buildQueryString } from "@/lib/api-client";
import type {
  ApiResponse,
  FavoriteCheckoutPayload,
  FavoriteCheckoutResponse,
  FavoriteItem,
} from "@/services/types";
// ⬇️ kalau punya tipe ini di lib kamu, import. Kalau tidak ada, lihat alternatif di bawah.
// import type { ApiClientErrorShape } from "@/lib/api-client";

// Kalau tidak ada tipe resminya, pakai fallback lokal yang kompatibel:
type ApiClientErrorShape = {
  message?: string;
  errors?: unknown;
  [k: string]: unknown;
};

type FavoriteListResponse = ApiResponse<FavoriteItem[]>;

const isApiClientErrorShape = (x: unknown): x is ApiClientErrorShape =>
  !!x && typeof x === "object";

const callInternal = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(init.headers ?? {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  // Hindari set JSON saat body adalah FormData
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
    cache: init.cache ?? "no-store",
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    // Safely extract message
    const payloadMsg =
      typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof (payload as any).message === "string"
        ? (payload as any).message
        : undefined;

    const message = payloadMsg ?? response.statusText ?? "Request failed";

    // ⬇️ Pastikan argumen ketiga sesuai union type yang diharapkan
    const details: string | ApiClientErrorShape | null =
      typeof payload === "string"
        ? payload
        : isApiClientErrorShape(payload)
          ? payload
          : null;

    throw new ApiError(response.status, message, details);
  }

  return payload as T;
};

const list = async (): Promise<FavoriteItem[]> => {
  const response = await callInternal<FavoriteListResponse>(
    "/api/customer/favorites",
  );
  return Array.isArray(response.data) ? response.data : [];
};

const add = async (productId: number, variantId?: number | null) => {
  const body =
    typeof variantId === "number"
      ? JSON.stringify({ variant_id: variantId })
      : undefined;

  return callInternal<ApiResponse<{ favorite_id: number }>>(
    `/api/customer/favorites/${productId}`,
    body
      ? { method: "POST", body }
      : { method: "POST" },
  );
};

const remove = async (productId: number, variantId?: number | null) => {
  const query = buildQueryString({ variant_id: variantId });
  return callInternal<ApiResponse<{ removed?: number }>>(
    `/api/customer/favorites/${productId}${query}`,
    { method: "DELETE" },
  );
};

const checkout = async (
  payload?: FavoriteCheckoutPayload,
): Promise<FavoriteCheckoutResponse> => {
  const body =
    payload
      ? { favorite_ids: payload.favorite_ids, note: payload.note }
      : undefined;

  const response = await callInternal<
    FavoriteCheckoutResponse & ApiResponse<unknown>
  >("/api/customer/favorites/checkout", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
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

export const FavoriteService = { list, add, remove, checkout };
export type FavoriteServiceType = typeof FavoriteService;