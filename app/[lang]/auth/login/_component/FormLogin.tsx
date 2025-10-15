"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import InputPassword from "@/components/ui-custom/form/InputPassword";
import { useAuthStore } from "@/store/auth-store";
import { setStoredToken, setStoredUser } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { authLoginDict, type AuthLoginLang } from "@/dictionaries/auth-login";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const LOGIN_ENDPOINT = "/api/auth/login";
const PENDING_WISHLIST_KEY = "pending_wishlist";

type LoginFormValues = { email: string; password: string };
type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string[]>>;

const initialValues: LoginFormValues = { email: "", password: "" };

export default function FormLogin({ lang: _lang }: { lang?: AuthLoginLang }) {
  const { lang: langFromParams } = useParams<{ lang: AuthLoginLang }>();
  const lang = (_lang ?? langFromParams ?? "id") as AuthLoginLang;
  const t = authLoginDict[lang] ?? authLoginDict.id;

  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  const callbackUrlParam = searchParams.get("callbackUrl") ?? "";
  const registerLink = callbackUrlParam
    ? `/${lang}/auth/register?callbackUrl=${encodeURIComponent(callbackUrlParam)}`
    : `/${lang}/auth/register`;

  const [formValues, setFormValues] = useState<LoginFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [statusMessage, setStatusMessage] = useState<
    | { type: "idle" }
    | { type: "error"; text: string }
    | { type: "success"; text: string }
  >({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  const clientErrors = useMemo<LoginFieldErrors>(() => {
    const errors: LoginFieldErrors = {};
    if (!formValues.email.trim()) {
      errors.email = [t.clientErrors.emailRequired];
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email)) {
      errors.email = [t.clientErrors.emailInvalid];
    }
    if (!formValues.password) {
      errors.password = [t.clientErrors.passwordRequired];
    }
    return errors;
  }, [formValues, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!process.env.NEXT_PUBLIC_API_URL) {
      setStatusMessage({ type: "error", text: t.clientErrors.envMissing });
      return;
    }
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatusMessage({ type: "error", text: t.clientErrors.checkInputs });
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setStatusMessage({ type: "idle" });

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": lang, // penting buat backend
        },
        credentials: "include",
        body: JSON.stringify({ ...formValues, lang }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFieldErrors(payload?.errors ?? {});
        setStatusMessage({
          type: "error",
          text: payload?.message ?? t.clientErrors.checkInputs,
        });
        return;
      }

      const token: string | null = payload?.token ?? null;
      const user = payload?.user ?? null;

      if (token) setStoredToken(token);
      setAuth({ token, user });
      setStoredUser(user);
      queryClient.setQueryData(queryKeys.auth.me, user ?? null);

      if (!token && typeof window !== "undefined") {
        window.localStorage.removeItem(PENDING_WISHLIST_KEY);
      }

      setStatusMessage({
        type: "success",
        text: payload?.message ?? t.successDefault,
      });

      const redirectTarget =
        callbackUrlParam && callbackUrlParam.startsWith("/")
          ? decodeURIComponent(callbackUrlParam)
          : `/${lang}`;

      setTimeout(() => router.replace(redirectTarget), 600);
    } catch (err) {
      console.error("Login request failed", err);
      setStatusMessage({ type: "error", text: t.clientErrors.genericFail });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldErrors = (field: keyof LoginFieldErrors) =>
    (fieldErrors[field] ?? []).map((message) => (
      <p key={message} className="text-sm text-red-600">
        {message}
      </p>
    ));

  return (
    <form className="space-y-6 font-['Plus_Jakarta_Sans']" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        name="email"
        value={formValues.email}
        onChange={handleChange}
        className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
        placeholder={t.emailPlaceholder}
        autoComplete="email"
      />
      {renderFieldErrors("email")}

      <InputPassword
        name="password"
        value={formValues.password}
        onChange={handleChange}
        placeholder={t.passwordPlaceholder}
        autoComplete="current-password"
      />
      {renderFieldErrors("password")}

      <div className="text-right">
        <Link href={`/${lang}/auth/forgot-password`} className={`text-primary text-[20px] underline ${jakartaSans.className}`}>
          {t.forgot}
        </Link>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white p-[10px] hover:bg-[#3a00b8] transition disabled:opacity-70"
      >
        {submitting ? t.processing : t.submit}
      </button>

      {statusMessage.type !== "idle" && (
        <p className={`text-sm ${statusMessage.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {"text" in statusMessage ? statusMessage.text : null}
        </p>
      )}

      <p className="text-center text-[20px] leading-[150%]">
        {t.needAccount}{" "}
        <Link className="text-[#191C42] font-semibold underline" href={registerLink}>
          {t.register}
        </Link>
      </p>
    </form>
  );
}
