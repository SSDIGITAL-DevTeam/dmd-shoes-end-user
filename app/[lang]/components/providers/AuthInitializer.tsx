"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

const SESSION_ENDPOINT = "/api/auth/user";

export default function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated) {
      return;
    }

    const controller = new AbortController();

    const hydrate = async () => {
      try {
        const response = await fetch(SESSION_ENDPOINT, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          clearAuth();
          return;
        }

        const payload = await response.json();
        setAuth({
          token: payload?.token ?? null,
          user: payload?.user ?? null,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to hydrate auth state", error);
          clearAuth();
        }
      } finally {
        setHydrated(true);
      }
    };

    hydrate();

    return () => controller.abort();
  }, [clearAuth, isHydrated, setAuth, setHydrated]);

  return null;
}
