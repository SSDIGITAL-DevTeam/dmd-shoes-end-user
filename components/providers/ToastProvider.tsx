"use client";

import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT, type ToastPayload } from "@/lib/toast";

type ActiveToast = ToastPayload & { expiresAt: number };

const DISPLAY_DURATION = 4000;
const TICK_INTERVAL = 500;

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastPayload>;
      if (!customEvent.detail) return;

      setToasts((prev) => [
        ...prev,
        {
          ...customEvent.detail,
          expiresAt: Date.now() + DISPLAY_DURATION,
        },
      ]);
    };

    window.addEventListener(TOAST_EVENT, handleToast as EventListener);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!toasts.length) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const tick = () => {
      const now = Date.now();
      setToasts((prev) => prev.filter((toast) => toast.expiresAt > now));
      timeoutRef.current = window.setTimeout(tick, TICK_INTERVAL);
    };

    timeoutRef.current = window.setTimeout(tick, TICK_INTERVAL);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [toasts.length]);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[1100] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const tone =
          toast.type === "success"
            ? "border-green-200 bg-green-50 text-green-800"
            : toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-slate-200 bg-white text-slate-800";

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto w-full rounded-md border px-4 py-3 text-sm shadow-lg transition ${tone}`}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
