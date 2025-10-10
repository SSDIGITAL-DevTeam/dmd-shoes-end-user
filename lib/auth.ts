const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const isBrowser = () => typeof window !== "undefined";

export const getStoredToken = (): string | null =>
  isBrowser() ? window.localStorage.getItem(TOKEN_KEY) : null;

export const setStoredToken = (token: string) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = (): boolean => !!getStoredToken();

export const getStoredUser = <T = unknown>(): T | null => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setStoredUser = (user: unknown) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
  } catch {
    // ignore storage errors (quota, etc.)
  }
};

export const clearStoredUser = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(USER_KEY);
};
