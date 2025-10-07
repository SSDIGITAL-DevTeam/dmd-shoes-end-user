"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import InputPassword from "@/components/ui-custom/form/InputPassword";
import { useAuthStore } from "@/store/auth-store";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_API_URL+"/login";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string[]>>;

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function FormLogin() {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const setAuth = useAuthStore((state) => state.setAuth);

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
      errors.email = ["Email is required."];
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(formValues.email)) {
      errors.email = ["Email is not valid."];
    }

    if (!formValues.password) {
      errors.password = ["Password is required."];
    }

    return errors;
  }, [formValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
        text: "Periksa kembali email dan password.",
      });
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
        },
        body: JSON.stringify(formValues),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(payload?.errors ?? {});
        setStatusMessage({
          type: "error",
          text: payload?.message ?? "Login gagal. Periksa kembali data Anda.",
        });
        return;
      }

      const token: string | null = payload?.token ?? null;
      const user = payload?.user ?? null;

      setAuth({ token, user });

      setStatusMessage({
        type: "success",
        text: payload?.message ?? "Login successful",
      });

      setTimeout(() => {
        router.replace(`/${lang}`);
      }, 600);
    } catch (error) {
      console.error("Login request failed", error);
      setStatusMessage({
        type: "error",
        text: "Terjadi kesalahan. Silakan coba lagi nanti.",
      });
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
    <form
      className="space-y-6 font-['Plus_Jakarta_Sans']"
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
        autoComplete="current-password"
      />
      {renderFieldErrors("password")}

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
        {submitting ? "Memproses..." : "Login"}
      </button>
      <p className="text-center text-[20px] leading-[150%]">
        Belum punya akun?
        {" "}
        <Link className="text-[#191C42] font-semibold underline" href={`/${lang}/auth/register`}>
          Daftar
        </Link>
      </p>
    </form>
  );
}
