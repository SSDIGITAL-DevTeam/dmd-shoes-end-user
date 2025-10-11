"use client";

import { ApiError } from "@/lib/api-client";

type ApiClientErrorShape = {
  message?: string;
  fields?: Record<string, unknown>;
  retry_after?: number;
  [key: string]: unknown;
};

type UpdateProfilePayload = {
  full_name: string;
  whatsapp_e164?: string | null;
};

type EmailChangePayload = {
  current_password: string;
  new_email: string;
  idempotencyKey?: string;
};

type EmailResendPayload = {
  new_email?: string | null;
};

type PasswordChangePayload = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== "undefined" && value instanceof FormData;

const callInternal = async <T>(
  path: string,
  init: RequestInit & { json?: Record<string, unknown> | null } = {},
): Promise<T> => {
  const { json, ...rest } = init;
  const headers = new Headers(rest.headers ?? {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  let body: BodyInit | undefined = rest.body as BodyInit | undefined;

  if (json !== undefined) {
    const jsonString = json ? JSON.stringify(json) : null;
    body = jsonString ?? undefined;
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  } else if (body && !headers.has("Content-Type") && !isFormData(body)) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Authorization") && typeof window !== "undefined") {
    try {
      const token = window.localStorage.getItem("auth_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // ignore storage issues
    }
  }

  const response = await fetch(path, {
    ...rest,
    headers,
    body,
    credentials: rest.credentials ?? "include",
    cache: rest.cache ?? "no-store",
  });

  let payload: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = text ? { message: text } : null;
    }
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof (payload as any).message === "string"
        ? (payload as any).message
        : response.statusText) || "Request failed";

    const details =
      typeof payload === "string"
        ? payload
        : payload && typeof payload === "object"
          ? (payload as ApiClientErrorShape)
          : null;

    throw new ApiError(response.status, String(message), details);
  }

  return payload as T;
};

const updateProfile = (payload: UpdateProfilePayload) =>
  callInternal<{ message?: string; data?: { full_name?: string; whatsapp_e164?: string | null } }>(
    "/api/me/profile",
    {
      method: "PATCH",
      json: payload,
    },
  );

const requestEmailChange = (payload: EmailChangePayload) => {
  const { idempotencyKey, ...body } = payload;

  return callInternal<{ status?: string; message?: string }>(
    "/api/me/email/change",
    {
      method: "POST",
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
      json: body,
    },
  );
};

const resendEmailVerification = (payload?: EmailResendPayload) =>
  callInternal<{ message?: string }>(
    "/api/me/email/resend",
    {
      method: "POST",
      json: payload ?? {},
    },
  );

const changePassword = (payload: PasswordChangePayload) =>
  callInternal<{ message?: string }>(
    "/api/me/password/change",
    {
      method: "POST",
      json: payload,
    },
  );

export const ProfileService = {
  updateProfile,
  requestEmailChange,
  resendEmailVerification,
  changePassword,
};

export type ProfileServiceType = typeof ProfileService;
