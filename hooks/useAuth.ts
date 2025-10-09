"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import type {
  Credentials,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "@/services/types";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/auth";
import { ApiError } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

const isBrowser = () => typeof window !== "undefined";

export type UseAuthReturn = {
  user: User | null;
  token: string | null;
  isAuthed: boolean;
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

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  useEffect(() => {
    if (!isBrowser()) return;

    const handler = (event: StorageEvent) => {
      if (event.key === "auth_token") {
        setToken(event.newValue);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (token) {
      setStoredToken(token);
    } else {
      clearStoredToken();
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    }
  }, [token, queryClient]);

  const userQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: AuthService.getMe,
    enabled: !!token,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        setToken(null);
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: ({ token: newToken, user }) => {
      setToken(newToken);
      queryClient.setQueryData(queryKeys.auth.me, user ?? null);
    },
  });

  const registerMutation = useMutation({
    mutationFn: AuthService.registerCustomer,
    onSuccess: ({ token: newToken, user }) => {
      if (newToken) {
        setToken(newToken);
      }
      if (user) {
        queryClient.setQueryData(queryKeys.auth.me, user);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSettled: () => {
      setToken(null);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: AuthService.forgotPassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: AuthService.resetPassword,
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) =>
      AuthService.resendVerification({ email }),
  });

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
    return data.data ?? null;
  }, [userQuery]);

  const user = useMemo(() => userQuery.data ?? null, [userQuery.data]);
  const error =
    loginMutation.error ??
    registerMutation.error ??
    logoutMutation.error ??
    userQuery.error;

  return {
    user,
    token,
    isAuthed: !!token && !!user,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
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
