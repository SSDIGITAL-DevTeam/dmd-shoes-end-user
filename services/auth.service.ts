import { ApiError, apiFetch } from "@/lib/api-client";
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

const parseJson = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : {};
};

const login = async (credentials: Credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
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

  if (token) {
    setStoredToken(token);
  } else {
    clearStoredToken();
  }

  if (user) {
    setStoredUser(user);
  } else {
    clearStoredUser();
  }

  return { token: token ?? null, user: user ?? null, raw: data };
};

const registerCustomer = async (payload: RegisterPayload) => {
  const response = await fetch("/api/auth/customer/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && data.message) ||
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

  if (token) {
    setStoredToken(token);
  } else {
    clearStoredToken();
  }

  if (user) {
    setStoredUser(user);
  } else {
    clearStoredUser();
  }

  return { token: token ?? null, user: user ?? null, raw: data };
};

const logout = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request failed", error);
  } finally {
    clearStoredToken();
    clearStoredUser();
  }
};

const forgotPassword = async (payload: ForgotPasswordPayload) =>
  apiFetch<ApiResponse<null>>("/password/forgot", {
    method: "POST",
    body: payload,
  });

const resetPassword = async (payload: ResetPasswordPayload) =>
  apiFetch<ApiResponse<null>>("/password/reset", {
    method: "POST",
    body: payload,
  });

const resendVerification = async (payload: { email: string }) =>
  apiFetch<ApiResponse<null>>("/email/resend", {
    method: "POST",
    body: payload,
  });

const getMe = async (): Promise<User | null> => {
  const existingToken = getStoredToken();
  const cachedUser = getStoredUser<User>();

  if (!existingToken) {
    clearStoredUser();
    return null;
  }

  try {
    const response = await fetch("/api/auth/user", {
      method: "GET",
      credentials: "include",
      headers: existingToken
        ? {
            Authorization: `Bearer ${existingToken}`,
          }
        : undefined,
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
        (data && typeof data === "object" && "message" in data && data.message) ||
        "Failed to fetch authenticated user.";
      throw new ApiError(response.status, String(message), data);
    }

    const token =
      typeof (data as any)?.token === "string"
        ? (data as any).token
        : typeof (data as any)?.data?.token === "string"
          ? (data as any).data.token
          : null;

    if (token) {
      setStoredToken(token);
    }

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
    if (cachedUser) {
      return cachedUser;
    }

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
  getMe,
};

export type AuthServiceType = typeof AuthService;
