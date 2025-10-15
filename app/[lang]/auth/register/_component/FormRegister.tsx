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

// ==== DICTIONARY TYPES ====
type RegisterDict = {
  title: string;
  placeholders: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  };
  button: { submit: string };
  links: { haveAccount: string; login: string };
  messages: {
    genericError: string;
    success: string;
  };
  validation: {
    name_required: string;
    email_required: string;
    email_invalid: string;
    password_required: string;
    password_min: string;
    password_confirmation_required: string;
    password_mismatch: string;
    phone_required: string;
    phone_invalid: string;
    form_invalid: string;
  };
};

export default function FormRegister({ dict }: { dict: RegisterDict }) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  const callbackUrlParam = searchParams.get("callbackUrl") ?? "";
  const loginLink = callbackUrlParam
    ? `/${lang}/auth/login?callbackUrl=${encodeURIComponent(callbackUrlParam)}`
    : `/${lang}/auth/login`;

  const [formValues, setFormValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ Pesan global di bawah tombol (rata kiri)
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clientErrors = useMemo<RegisterFieldErrors>(() => {
    const errors: RegisterFieldErrors = {};

    if (!formValues.name.trim()) errors.name = [dict.validation.name_required];

    if (!formValues.email.trim()) {
      errors.email = [dict.validation.email_required];
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email)) {
      errors.email = [dict.validation.email_invalid];
    }

    if (!formValues.password) {
      errors.password = [dict.validation.password_required];
    } else if (formValues.password.length < 8) {
      errors.password = [dict.validation.password_min];
    }

    if (!formValues.password_confirmation) {
      errors.password_confirmation = [dict.validation.password_confirmation_required];
    } else if (formValues.password !== formValues.password_confirmation) {
      errors.password_confirmation = [dict.validation.password_mismatch];
    }

    if (!formValues.phone.trim()) {
      errors.phone = [dict.validation.phone_required];
    } else if (!/^\+\d{8,15}$/.test(formValues.phone)) {
      errors.phone = [dict.validation.phone_invalid];
    }

    return errors;
  }, [formValues, dict]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value?: string) => {
    setFormValues((prev) => ({ ...prev, phone: value ?? prev.phone }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Reset state pesan
    setGlobalError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // Validasi client-side
    const hasClientErrors = Object.keys(clientErrors).length > 0;
    if (hasClientErrors) {
      setFieldErrors(clientErrors);
      setGlobalError(dict.validation.form_invalid);
      return;
    }

    setSubmitting(true);

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
        const fieldErrs: RegisterFieldErrors = payload?.errors ?? {};

        // ✅ Jadikan error email → pesan global tunggal
        if (fieldErrs.email?.length) {
          setGlobalError(fieldErrs.email[0]); // tampilkan apa adanya dari backend
          delete fieldErrs.email;
        } else {
          setGlobalError(payload?.message ?? dict.messages.genericError);
        }

        setFieldErrors(fieldErrs);
        return;
      }

      const token: string | null = payload?.data?.token ?? null;
      const user = payload?.data?.user ?? null;

      if (token) setStoredToken(token);
      setAuth({ token, user });
      setStoredUser(user);

      // Restore pending wishlist jika ada
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
                    pending.variantId ?? undefined
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

      setSuccessMessage(payload?.message ?? dict.messages.success);

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
      setGlobalError(dict.messages.genericError);
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
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
          placeholder={dict.placeholders.name}
          autoComplete="name"
        />
        {renderFieldErrors("name")}

        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
          placeholder={dict.placeholders.email}
          autoComplete="email"
        />
        {/* ❌ Tidak render error email di sini */}

        <InputPassword
          name="password"
          value={formValues.password}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder={dict.placeholders.password}
        />
        {renderFieldErrors("password")}

        <InputPassword
          name="password_confirmation"
          placeholder={dict.placeholders.password_confirmation}
          value={formValues.password_confirmation}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {renderFieldErrors("password_confirmation")}

        <PhoneInput
          placeholder={dict.placeholders.phone}
          value={formValues.phone}
          onChange={handlePhoneChange}
          defaultCountry="ID"
          international
          countryCallingCodeEditable={false}
          className={`register-phone w-full ${jakartaSans.className}`}
        />
        {renderFieldErrors("phone")}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white p-[10px] hover:bg-[#3a00b8] transition disabled:opacity-70"
        >
          {submitting ? `${dict.button.submit}...` : dict.button.submit}
        </button>

        {/* ✅ Pesan global di bawah tombol, rata kiri */}
        {globalError && (
          <p className="mt-2 text-sm text-red-600 text-left">{globalError}</p>
        )}
        {successMessage && (
          <p className="mt-2 text-sm text-green-600 text-left">
            {successMessage}
          </p>
        )}

        <p className="text-[20px] text-center leading-[150%]">
          {dict.links.haveAccount}{" "}
          <Link className="text-[#191C42] font-semibold underline" href={loginLink}>
            {dict.links.login}
          </Link>
        </p>
      </form>

      {/* Styles untuk PhoneInput */}
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
