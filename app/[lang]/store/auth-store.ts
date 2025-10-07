import { create } from "zustand";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status?: boolean;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  setAuth: (payload: { token: string | null; user: AuthUser | null }) => void;
  clearAuth: () => void;
  setHydrated: (value?: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  setAuth: ({ token, user }) =>
    set({
      token: token ?? null,
      user: user ?? null,
      isHydrated: true,
    }),
  clearAuth: () =>
    set({
      token: null,
      user: null,
      isHydrated: true,
    }),
  setHydrated: (value = true) =>
    set({
      isHydrated: value,
    }),
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "DELETE" });
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      set({ token: null, user: null, isHydrated: true });
    }
  },
}));
