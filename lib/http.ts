const RAW_API = process.env.NEXT_PUBLIC_API_URL;
const API = typeof RAW_API === "string" ? RAW_API.replace(/\/+$/, "") : null;

export class HttpError<T = any> extends Error {
  status: number;
  data: T | null;

  constructor(status: number, message: string, data: T | null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetcherOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  authToken?: string | null;
  next?: { revalidate?: number } | undefined;
  cache?: RequestCache;
  credentials?: RequestCredentials;
};

const isFormData = (value: any): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const isBlob = (value: any): value is Blob =>
  typeof Blob !== "undefined" && value instanceof Blob;

const toJsonBody = (body: any) => {
  if (
    body === undefined ||
    body === null ||
    typeof body === "string" ||
    isFormData(body) ||
    isBlob(body)
  ) {
    return body ?? undefined;
  }
  return JSON.stringify(body);
};

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  if (path.startsWith("/api/")) {
    return path;
  }
  if (!API) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured. Check your environment variables.");
  }
  return `${API}/${path.replace(/^\/+/, "")}`;
};

export async function apiFetch<T>(path: string, opt: FetcherOptions = {}) {
  const url = buildUrl(path);
  const jsonEncodedBody = toJsonBody(opt.body);
  const shouldMarkJson =
    jsonEncodedBody !== undefined &&
    typeof jsonEncodedBody === "string" &&
    opt.body &&
    typeof opt.body !== "string";

  const res = await fetch(url, {
    method: opt.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(shouldMarkJson ? { "Content-Type": "application/json" } : {}),
      ...(opt.authToken ? { Authorization: `Bearer ${opt.authToken}` } : {}),
      ...opt.headers,
    },
    body: jsonEncodedBody,
    cache: opt.cache ?? "no-store",
    next: opt.next ?? { revalidate: 0 },
    credentials: opt.credentials ?? "include",
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? ({ message: text } as any) : null;
  }

  if (!res.ok) {
    const reason =
      (data && typeof data === "object" && "message" in data
        ? String((data as any).message ?? res.statusText)
        : res.statusText) || "Unknown error";
    throw new HttpError(res.status, reason, data);
  }

  return data as T;
}
