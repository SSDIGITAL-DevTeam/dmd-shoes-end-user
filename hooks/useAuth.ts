"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import type {
  Credentials,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "@/services/types";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { getStoredToken } from "@/lib/auth";

// (Opsional) kalau kamu punya hook lang, boleh pakai:
// import { useLang } from "@/hooks/use-lang";

type UseAuthReturn = {
  user: User | null;
  isAuthed: boolean;
  isReady: boolean;
  isLoading: boolean;
  isFetchingUser: boolean;
  error: unknown;
  login: (payload: Credentials) => Promise<User | null>;
  register: (payload: RegisterPayload) => Promise<User | null>;
  logout: () => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  refetchUser: () => Promise<User | null>;
};

// Import tipe AuthUser dari store agar setAuth tidak error
import type { AuthUser } from "@/app/[lang]/store/auth-store";

function toAuthUser(u: unknown): AuthUser | null {
  if (!u || typeof u !== "object") return null;
  const x = u as Record<string, unknown>;
  if (x.id && x.email && x.role) return u as AuthUser;
  return null;
}

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();

  const { token: storeToken, user: storeUser, setAuth, clearAuth } =
    useAuthStore((state) => ({
      token: state.token,
      user: state.user,
      setAuth: state.setAuth,
      clearAuth: state.clearAuth,
    }));

  // const lang = useLang(); // gunakan jika perlu; contoh di bawah tidak bergantung lang

  /** =======================
   *  Queries & Mutations
   *  ======================= */

  // ❗️JANGAN langsung pass AuthService.getMe
  const userQuery = useQuery({
    queryKey: queryKeys.auth.me, // mis: ["auth","me"]
    queryFn: async () => {
      // kalau perlu lang: return AuthService.getMe(lang);
      return AuthService.getMe(); // User | null
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload: Credentials) => {
      // kalau perlu lang: return AuthService.login(payload, lang);
      return AuthService.login(payload);
    },
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.me, user ?? null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: async (payload: RegisterPayload) => {
      // kalau perlu lang: return AuthService.registerCustomer(payload, lang);
      return AuthService.registerCustomer(payload);
    },
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.me, user ?? null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => AuthService.logout(),
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationKey: ["auth", "forgot"],
    mutationFn: async (payload: ForgotPasswordPayload) => {
      // kalau perlu lang: return AuthService.forgotPassword(payload, lang);
      return AuthService.forgotPassword(payload);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["auth", "reset"],
    mutationFn: async (payload: ResetPasswordPayload) => {
      // kalau perlu lang: return AuthService.resetPassword(payload, lang);
      return AuthService.resetPassword(payload);
    },
  });

  const resendVerificationMutation = useMutation({
    mutationKey: ["auth", "resend-verification"],
    mutationFn: async (email: string) => AuthService.resendVerification({ email }),
  });

  /** =======================
   *  Actions
   *  ======================= */

  const login = useCallback(
    async (payload: Credentials) => {
      const result = await loginMutation.mutateAsync(payload);
      return result.user ?? null;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const result = await registerMutation.mutateAsync(payload);
      return result.user ?? null;
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordPayload) => {
      await forgotPasswordMutation.mutateAsync(payload);
    },
    [forgotPasswordMutation],
  );

  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload) => {
      await resetPasswordMutation.mutateAsync(payload);
    },
    [resetPasswordMutation],
  );

  const resendVerification = useCallback(
    async (email: string) => {
      await resendVerificationMutation.mutateAsync(email);
    },
    [resendVerificationMutation],
  );

  const refetchUser = useCallback(async () => {
    const data = await userQuery.refetch();
    // TanStack kembalikan {data?: T}; pastikan return User | null
    return (data.data ?? null) as User | null;
  }, [userQuery]);

  /** =======================
   *  Derived state
   *  ======================= */

  const fetchedUser = (userQuery.data ?? null) as User | null;

  // UI butuh User | null → ambil dari query atau mapping dari store
  const user = useMemo<User | null>(() => {
    if (fetchedUser) return fetchedUser;
    // storeUser bertipe AuthUser | null → cast aman ke User | null bila strukturnya sama
    return (storeUser as unknown as User | null) ?? null;
  }, [fetchedUser, storeUser]);

  const error =
    loginMutation.error ??
    registerMutation.error ??
    logoutMutation.error ??
    userQuery.error;

  const isAuthed = !!(user ?? storeUser);
  const isReady = userQuery.isFetched || userQuery.isSuccess || userQuery.isError;

  /** =======================
   *  Sync ke store
   *  ======================= */
  useEffect(() => {
    if (userQuery.status === "success") {
      const token = getStoredToken() ?? storeToken ?? null;
      const storeCompatible = toAuthUser(fetchedUser);
      if (storeCompatible) {
        setAuth({ token, user: storeCompatible });
      } else {
        clearAuth();
      }
    } else if (userQuery.status === "error") {
      clearAuth();
    }
  }, [userQuery.status, fetchedUser, setAuth, clearAuth, storeToken]);

  return {
    user,
    isAuthed,
    isReady,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending ||
      userQuery.isLoading,
    isFetchingUser: userQuery.isFetching,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    resendVerification,
    refetchUser,
  };
};
