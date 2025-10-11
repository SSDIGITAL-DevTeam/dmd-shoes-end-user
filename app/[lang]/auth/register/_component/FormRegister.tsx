"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import InputPassword from "@/components/ui-custom/form/InputPassword";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuthStore } from "@/store/auth-store";
import { setStoredToken, setStoredUser } from "@/lib/auth";
import { FavoriteService } from "@/services/favorite.service";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

//const REGISTER_ENDPOINT = "/api/auth/customer/register";
const REGISTER_ENDPOINT = "/api/auth/customer/register";
const PENDING_WISHLIST_KEY = "pending_wishlist";

type PendingFavorite = {
  productId: number;
  variantId?: number | null;
};
type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
};

type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string[]>>;

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone: "",
};

export default function FormRegister() {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  const callbackUrlParam = searchParams.get("callbackUrl") ?? "";
  const loginLink = callbackUrlParam
    ? `/${lang}/auth/login?callbackUrl=${encodeURIComponent(callbackUrlParam)}`
    : `/${lang}/auth/login`;

  const [formValues, setFormValues] = useState<RegisterFormValues>(
    initialValues,
  );
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [statusMessage, setStatusMessage] = useState<
    | { type: "idle" }
    | { type: "error"; text: string }
    | { type: "success"; text: string }
  >({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  const clientErrors = useMemo<RegisterFieldErrors>(() => {
    const errors: RegisterFieldErrors = {};

    if (!formValues.name.trim()) {
      errors.name = ["Name is required."];
    }

    if (!formValues.email.trim()) {
      errors.email = ["Email is required."];
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email)) {
      errors.email = ["Email is not valid."];
    }

    if (!formValues.password) {
      errors.password = ["Password is required."];
    } else if (formValues.password.length < 8) {
      errors.password = ["Password must be at least 8 characters long."];
    }

    if (!formValues.password_confirmation) {
      errors.password_confirmation = [
        "Password confirmation is required.",
      ];
    } else if (formValues.password !== formValues.password_confirmation) {
      errors.password_confirmation = ["Passwords do not match."];
    }

    if (!formValues.phone.trim()) {
      errors.phone = ["Phone is required."];
    } else if (!/^\+\d{8,15}$/.test(formValues.phone)) {
      errors.phone = ["Phone must be in E.164 format (e.g. +62812...)."];
    }

    return errors;
  }, [formValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value?: string) => {
    setFormValues((prev) => ({ ...prev, phone: value ?? prev.phone }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!process.env.NEXT_PUBLIC_API_URL) {
      setStatusMessage({
        type: "error",
        text: "NEXT_PUBLIC_API_URL belum diset pada .env.local.",
      });
      return;
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatusMessage({
        type: "error",
        text: "Periksa kembali data yang kamu isi.",
      });
      return;
    }

    setSubmitting(true);
    setStatusMessage({ type: "idle" });
    setFieldErrors({});

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formValues),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(payload?.errors ?? {});
        setStatusMessage({
          type: "error",
          text:
            payload?.message ??
            "Registrasi gagal. Silakan periksa data yang dimasukkan.",
        });
        return;
      }

      const token: string | null = payload?.data?.token ?? null;
      const user = payload?.data?.user ?? null;

      if (token) {
        setStoredToken(token);
      }

      setAuth({ token, user });
      setStoredUser(user);

      if (token) {
        try {
          if (typeof window !== "undefined") {
            const pendingRaw = window.localStorage.getItem(PENDING_WISHLIST_KEY);
            if (pendingRaw) {
              try {
                const pending: PendingFavorite = JSON.parse(pendingRaw);
                if (pending?.productId) {
                  await FavoriteService.add(
                    pending.productId,
                    pending.variantId ?? undefined,
                  );
                }
              } catch (wishlistError) {
                console.error("Failed to restore wishlist", wishlistError);
              } finally {
                window.localStorage.removeItem(PENDING_WISHLIST_KEY);
              }
            }
          }
        } catch (wishlistError) {
          console.error("Wishlist processing error", wishlistError);
        }
      } else if (typeof window !== "undefined") {
        window.localStorage.removeItem(PENDING_WISHLIST_KEY);
      }

      setStatusMessage({
        type: "success",
        text:
          payload?.message ??
          "Registered successfully. Please verify your email.",
      });

      const redirectTarget =
        callbackUrlParam && callbackUrlParam.startsWith("/")
          ? decodeURIComponent(callbackUrlParam)
          : `/${lang}`;

      queryClient.setQueryData(queryKeys.auth.me, user ?? null);

      setTimeout(() => {
        router.replace(redirectTarget);
      }, 800);
    } catch (error) {
      console.error("Register request failed", error);
      setStatusMessage({
        type: "error",
        text: "Terjadi kesalahan. Silakan coba lagi nanti.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderFieldErrors = (field: keyof RegisterFieldErrors) =>
    (fieldErrors[field] ?? []).map((message) => (
      <p key={message} className="text-sm text-red-600">
        {message}
      </p>
    ));

  return (
    <>
      <form
      className="space-y-3 font-['Plus_Jakarta_Sans']"
      onSubmit={handleSubmit}
      noValidate
    >
      {statusMessage.type !== "idle" && (
        <p
          className={`text-sm ${
            statusMessage.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {"text" in statusMessage ? statusMessage.text : null}
        </p>
      )}

      <input
        type="text"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
        placeholder="Name"
        autoComplete="name"
      />
      {renderFieldErrors("name")}

      <input
        type="email"
        name="email"
        value={formValues.email}
        onChange={handleChange}
        className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
        placeholder="Email"
        autoComplete="email"
      />
      {renderFieldErrors("email")}

      <InputPassword
        name="password"
        value={formValues.password}
        onChange={handleChange}
        autoComplete="new-password"
      />
      {renderFieldErrors("password")}

      <InputPassword
        name="password_confirmation"
        placeholder="Konfirmasi kata sandi"
        value={formValues.password_confirmation}
        onChange={handleChange}
        autoComplete="new-password"
      />
      {renderFieldErrors("password_confirmation")}

      <PhoneInput
        placeholder="Phone Number"
        value={formValues.phone}
        onChange={handlePhoneChange}
        defaultCountry="ID"
        international
        countryCallingCodeEditable={false}
        className={`register-phone w-full ${jakartaSans.className}`}
      />
      {renderFieldErrors("phone")}

      <div className="text-right">
        <Link
          href={`/${lang}/auth/forgot-password`}
          className={`text-primary text-[20px] underline  ${jakartaSans.className}`}
        >
          Lupa kata sandi?
        </Link>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white p-[10px]  hover:bg-[#3a00b8] transition disabled:opacity-70"
      >
        {submitting ? "Memproses..." : "Daftar"}
      </button>
      <p className="text-center text-[20px] leading-[150%]">
        Sudah punya akun?
        {" "}
        <Link
          className="text-[#191C42] font-semibold underline"
          href={loginLink}
        >
          Masuk
        </Link>
      </p>
      </form>
      <style jsx global>{`
      .register-phone {
        display: flex;
        align-items: center;
        width: 100%;
      }
      .register-phone input {
        flex: 1;
        min-width: 0;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 0.75rem;
        outline: none;
        transition: 0.2s;
      }
      .register-phone input:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4);
      }
      .register-phone .PhoneInputCountry {
        margin-right: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 0.75rem;
        background: white;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .register-phone .PhoneInputCountrySelect {
        outline: none;
      }
    `}</style>
    </>
  );
}


