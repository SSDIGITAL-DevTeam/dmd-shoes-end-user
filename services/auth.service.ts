import { apiFetch, withAuth } from "@/lib/api-client";
import { clearStoredToken, setStoredToken } from "@/lib/auth";
import type {
  ApiResponse,
  Credentials,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "@/services/types";

type LoginResponse =
  | (ApiResponse<{ user: User; token: string }> & { user?: User; token?: string })
  | {
      status?: string | boolean;
      message?: string;
      user?: User;
      token?: string;
      [key: string]: unknown;
    };

type RegisterResponse = ApiResponse<{ user: User; token?: string }>;

const extractToken = (payload: LoginResponse | RegisterResponse): string | null => {
  if (!payload) return null;

  if ("token" in payload && typeof payload.token === "string") {
    return payload.token;
  }

  if ("data" in payload && payload.data && typeof payload.data === "object") {
    const data = payload.data as { token?: string };
    if (typeof data.token === "string") {
      return data.token;
    }
  }

  return null;
};

const extractUser = (payload: LoginResponse | RegisterResponse): User | null => {
  if (!payload) return null;

  if ("user" in payload && payload.user) {
    return payload.user as User;
  }

  if ("data" in payload && payload.data && typeof payload.data === "object") {
    const data = payload.data as { user?: User };
    if (data.user) {
      return data.user;
    }
  }

  return null;
};

const login = async (credentials: Credentials) => {
  const response = await apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: credentials,
  });

  const token = extractToken(response);
  const user = extractUser(response);

  if (!token) {
    throw new Error("Login response did not include an access token.");
  }

  setStoredToken(token);

  return { token, user: user ?? null, raw: response };
};

const registerCustomer = async (payload: RegisterPayload) => {
  const response = await apiFetch<RegisterResponse>("/auth/customer/register", {
    method: "POST",
    body: payload,
  });

  const token = extractToken(response);
  const user = extractUser(response);

  if (token) {
    setStoredToken(token);
  }

  return { token: token ?? null, user: user ?? null, raw: response };
};

const logout = async () => {
  try {
    await apiFetch<ApiResponse<null>>("/logout", {
      method: "POST",
      ...withAuth(),
    });
  } finally {
    clearStoredToken();
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

const getMe = async (): Promise<User> => {
  const response = await apiFetch<User>("/user", {
    method: "GET",
    ...withAuth(),
  });
  return response;
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
