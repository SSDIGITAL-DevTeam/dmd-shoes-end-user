const TOKEN_KEY = "auth_token";

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
