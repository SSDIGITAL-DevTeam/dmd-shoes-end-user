"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthInitializer() {
  const { token, refetchUser } = useAuth();

  useEffect(() => {
    if (token) {
      refetchUser().catch(() => {
        /* handled in hook */
      });
    }
  }, [token, refetchUser]);

  return null;
}
