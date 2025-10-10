"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { getStoredToken, getStoredUser } from "@/lib/auth";
import type { User } from "@/services/types";

export default function AuthInitializer() {
  const { isReady, isFetchingUser, refetchUser } = useAuth();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser<User>();

    if (token || user) {
      setAuth({ token: token ?? null, user: user ?? null });
    } else {
      setHydrated(true);
    }
  }, [setAuth, setHydrated]);

  useEffect(() => {
    if (!isReady && !isFetchingUser) {
      refetchUser().catch(() => {
        /* handled in hook */
      });
    }
  }, [isReady, isFetchingUser, refetchUser]);

  return null;
}
