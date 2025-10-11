"use client";

export type ToastType = "success" | "error" | "info";

export type ToastPayload = {
  id: string;
  type: ToastType;
  message: string;
};

export const TOAST_EVENT = "app:toast";

let fallbackIncrement = 0;

const generateId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      // ignore and use fallback
    }
  }
  fallbackIncrement += 1;
  return `toast-${Date.now()}-${fallbackIncrement}`;
};

const emit = (type: ToastType, message: string) => {
  if (!message) return;

  if (typeof window === "undefined") {
    const prefix =
      type === "error" ? "[toast:error]" : type === "success" ? "[toast:success]" : "[toast]";
    console.info(`${prefix} ${message}`);
    return;
  }

  const payload: ToastPayload = {
    id: generateId(),
    type,
    message,
  };

  window.dispatchEvent(new CustomEvent<ToastPayload>(TOAST_EVENT, { detail: payload }));
};

export const toast = {
  success: (message: string) => emit("success", message),
  error: (message: string) => emit("error", message),
  info: (message: string) => emit("info", message),
};
