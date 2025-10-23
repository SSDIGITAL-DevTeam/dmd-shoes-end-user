import { API_URL } from "@/lib/env";
import { getStoredToken } from "@/lib/auth";
import { hydrateAssets } from "./assets";

export type ApiClientErrorShape = {
  status?: string | number | boolean;
  message?: string;
  errors?: unknown;
  [key: string]: unknown;
};

export class ApiError extends Error {
  statusCode: number;
  body?: ApiClientErrorShape | string | null;

  constructor(statusCode: number, message: string, body?: ApiClientErrorShape | string | null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.body = body;
  }
}

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const normalizeUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  if (!path.startsWith("/")) {
    return `${API_URL}/${path}`;
  }
  return `${API_URL}${path}`;
};

const isBlob = (value: unknown): value is Blob =>
  typeof Blob !== "undefined" && value instanceof Blob;

const isURLSearchParams = (value: unknown): value is URLSearchParams =>
  typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams;

const isArrayBuffer = (value: unknown): value is ArrayBuffer =>
  typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer;

const isArrayBufferView = (value: unknown): value is ArrayBufferView =>
  typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value);

const buildHeaders = (init?: ApiRequestInit): Headers => {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  const body = init?.body;
  if (body && !isFormData(body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

const parseBody = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text.length ? text : null;
};

export type ApiRequestInit = Omit<RequestInit, "body" | "next"> & {
  body?: Record<string, unknown> | unknown[] | BodyInit | null | undefined;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const normalizeBody = (
  body: ApiRequestInit["body"],
): BodyInit | null | undefined => {
  if (body === undefined) return undefined;
  if (body === null) return null;
  if (typeof body === "string") return body;
  if (isFormData(body)) return body;
  if (isBlob(body)) return body;
  if (isURLSearchParams(body)) return body;
  if (isArrayBuffer(body)) return body;
  if (isArrayBufferView(body)) return body;

  return JSON.stringify(body);
};

export const apiFetch = async <T = unknown>(path: string, init?: ApiRequestInit): Promise<T> => {
  const url = normalizeUrl(path);
  const headers = buildHeaders(init);
  const { body, headers: _headers, ...rest } = init ?? {};

  const fetchInit: RequestInit = {
    ...rest,
    headers,
  };

  if (body !== undefined) {
    fetchInit.body = normalizeBody(body);
  }

  const response = await fetch(url, fetchInit);
  const payload = await parseBody(response);
  const hydrated = hydrateAssets(payload);

  if (!response.ok) {
    const message =
      (typeof hydrated === "object" && hydrated !== null && "message" in hydrated
        ? String((hydrated as any).message)
        : response.statusText) || "Request failed";
    throw new ApiError(response.status, message, hydrated);
  }

  return hydrated as T;
};

export const withAuth = (init: ApiRequestInit = {}): ApiRequestInit => {
  const token = getStoredToken();
  const headers = new Headers(init.headers ?? {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  };
};

export const buildQueryString = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};
