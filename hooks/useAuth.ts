"use client";

import { useCallback, useEffect, useMemo } from "react";
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
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { getStoredToken } from "@/lib/auth";

export type UseAuthReturn = {
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

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();
  const { token: storeToken, user: storeUser, setAuth, clearAuth } = useAuthStore((state) => ({
    token: state.token,
    user: state.user,
    setAuth: state.setAuth,
    clearAuth: state.clearAuth,
  }));

  const userQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: AuthService.getMe,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.me, user ?? null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });

  const registerMutation = useMutation({
    mutationFn: AuthService.registerCustomer,
    onSuccess: ({ user }) => {
      if (user) {
        queryClient.setQueryData(queryKeys.auth.me, user);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
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

  const fetchedUser = userQuery.data ?? null;
  const user = useMemo(() => fetchedUser ?? storeUser ?? null, [fetchedUser, storeUser]);
  const error =
    loginMutation.error ??
    registerMutation.error ??
    logoutMutation.error ??
    userQuery.error;
  const isAuthed = !!(user ?? storeUser);
  const isReady = userQuery.isFetched || userQuery.isSuccess || userQuery.isError;

  useEffect(() => {
    if (userQuery.status === "success") {
      if (fetchedUser) {
        const token = getStoredToken() ?? storeToken ?? null;
        setAuth({ token, user: fetchedUser });
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
