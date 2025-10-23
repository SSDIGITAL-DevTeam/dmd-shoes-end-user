// services/auth.service.ts
import { ApiError } from "@/lib/api-client";
import { apiFetch as httpFetch } from "@/lib/http";
import {
  clearStoredToken,
  setStoredToken,
  getStoredToken,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
} from "@/lib/auth";
import type {
  ApiResponse,
  Credentials,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "@/services/types";

const withLang = (url: string, lang?: string) =>
  lang ? `${url}${url.includes("?") ? "&" : "?"}lang=${lang}` : url;

const parseJson = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();
  const text = await response.text();
  return text ? { message: text } : {};
};

const login = async (credentials: Credentials, lang?: string) => {
  const response = await fetch(withLang("/api/auth/login", lang), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(lang ? { "Accept-Language": lang } : {}),
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && (data as any).message) ||
      "Login failed.";
    throw new ApiError(response.status, String(message), data);
  }

  const token =
    typeof (data as any)?.token === "string"
      ? (data as any).token
      : typeof (data as any)?.data?.token === "string"
        ? (data as any).data.token
        : null;

  const user =
    ((data as any)?.user as User | undefined) ??
    ((data as any)?.data?.user as User | undefined) ??
    null;

  token ? setStoredToken(token) : clearStoredToken();
  user ? setStoredUser(user) : clearStoredUser();

  return { token: token ?? null, user: user ?? null, raw: data };
};

const registerCustomer = async (payload: RegisterPayload, lang?: string) => {
  const response = await fetch(withLang("/api/auth/customer/register", lang), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(lang ? { "Accept-Language": lang } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && (data as any).message) ||
      "Registration failed.";
    throw new ApiError(response.status, String(message), data);
  }

  const token =
    typeof (data as any)?.token === "string"
      ? (data as any).token
      : typeof (data as any)?.data?.token === "string"
        ? (data as any).data.token
        : null;

  const user =
    ((data as any)?.user as User | undefined) ??
    ((data as any)?.data?.user as User | undefined) ??
    null;

  token ? setStoredToken(token) : clearStoredToken();
  user ? setStoredUser(user) : clearStoredUser();

  return { token: token ?? null, user: user ?? null, raw: data };
};

const logout = async () => {
  try {
    await fetch("/api/auth/logout", { method: "DELETE", credentials: "include" });
  } catch (e) {
    console.error("Logout request failed", e);
  } finally {
    clearStoredToken();
    clearStoredUser();
  }
};

// === Perhatikan path sesuai routes Laravel (/v1/password/forgot & /v1/password/reset, /v1/email/resend)
const forgotPassword = async (payload: ForgotPasswordPayload, lang?: string) =>
  httpFetch<ApiResponse<null>>(withLang("/api/password/forgot", lang), {
    method: "POST",
    body: payload,
    headers: lang ? { "Accept-Language": lang } : undefined,
  });

const resetPassword = async (payload: ResetPasswordPayload, lang?: string) =>
  httpFetch<ApiResponse<null>>(withLang("/api/password/reset", lang), {
    method: "POST",
    body: payload,
    headers: lang ? { "Accept-Language": lang } : undefined,
  });

const resendVerification = async (payload: { email: string }, lang?: string) =>
  httpFetch<ApiResponse<null>>(withLang("/api/email/resend", lang), {
    method: "POST",
    body: payload,
    headers: lang ? { "Accept-Language": lang } : undefined,
  });

// Verifikasi via link GET signed URL biasanya tidak melalui API JSON.
// Ini disediakan jika kamu punya endpoint POST alternatif.
const verifyEmailCode = async (payload: { email: string; code: string }, lang?: string) =>
  httpFetch<ApiResponse<null>>(withLang("/api/email/verify", lang), {
    method: "POST",
    body: payload,
    headers: lang ? { "Accept-Language": lang } : undefined,
  });

const getMe = async (lang?: string): Promise<User | null> => {
  const existingToken = getStoredToken();
  const cachedUser = getStoredUser<User>();

  if (!existingToken) {
    clearStoredUser();
    return null;
  }

  try {
    const response = await fetch(withLang("/api/auth/user", lang), {
      method: "GET",
      credentials: "include",
      headers: {
        ...(existingToken ? { Authorization: `Bearer ${existingToken}` } : {}),
        ...(lang ? { "Accept-Language": lang } : {}),
      },
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (response.status === 401) {
      clearStoredToken();
      clearStoredUser();
      return null;
    }

    if (!response.ok) {
      const message =
        (data && typeof data === "object" && "message" in data && (data as any).message) ||
        "Failed to fetch authenticated user.";
      throw new ApiError(response.status, String(message), data);
    }

    const token =
      typeof (data as any)?.token === "string"
        ? (data as any).token
        : typeof (data as any)?.data?.token === "string"
          ? (data as any).data.token
          : null;

    if (token) setStoredToken(token);

    const user =
      ((data as any)?.user as User | undefined) ??
      ((data as any)?.data?.user as User | undefined) ??
      ((data as any)?.data as User | undefined) ??
      null;

    if (user) {
      setStoredUser(user);
      return user;
    }

    clearStoredUser();
    return null;
  } catch (error) {
    if (cachedUser) return cachedUser;
    throw error;
  }
};

export const AuthService = {
  login,
  registerCustomer,
  logout,
  forgotPassword,
  resetPassword,
  resendVerification,
  verifyEmailCode,
  getMe,
};

export type AuthServiceType = typeof AuthService;
