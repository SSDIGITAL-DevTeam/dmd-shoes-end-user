"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import InputPassword from "@/components/ui-custom/form/InputPassword";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuthStore } from "@/store/auth-store";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const REGISTER_ENDPOINT = "/api/auth/customer/register";

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
  const setAuth = useAuthStore((state) => state.setAuth);

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
    }

    return errors;
  }, [formValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value?: string) => {
    setFormValues((prev) => ({ ...prev, phone: value ?? "" }));
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

      setAuth({ token, user });

      setStatusMessage({
        type: "success",
        text:
          payload?.message ??
          "Registered successfully. Please verify your email.",
      });

      setTimeout(() => {
        router.replace(`/${lang}`);
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
        className="w-full"
        inputComponent={(props) => (
          <input
            {...props}
            className={`w-full text-[#121212]/75 text-[20px] font-medium border-b 
                  border-[#1212124D] px-[10px] py-[10px] focus:outline-none 
                  focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
          />
        )}
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
          href={`/${lang}/auth/login`}
        >
          Masuk
        </Link>
      </p>
    </form>
  );
}
