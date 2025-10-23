"use client";

import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { HiCheckBadge } from "react-icons/hi2";
import { Plus_Jakarta_Sans } from "next/font/google";
import InputPassword from "@/components/ui-custom/form/InputPassword";
import { AuthService } from "@/services/auth.service";
import { HttpError } from "@/lib/http";
import type { Locale } from "@/i18n-config";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type FormValues = {
  password: string;
  confirmPassword: string;
};

type Props = {
  lang: Locale;
  email: string;
  token: string;
};

export default function FormChangePassword({ lang, email, token }: Props) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maskedEmail = useMemo(() => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const visible = name.slice(0, 3);
    return `${visible}${"•".repeat(Math.max(1, name.length - visible.length))}@${domain}`;
  }, [email]);

  const onSubmit = async (data: FormValues) => {
    setErrorMessage(null);

    if (!token || !email) {
      setErrorMessage(
        "Token reset tidak ditemukan. Pastikan Anda membuka tautan reset kata sandi terbaru dari email.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await AuthService.resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof HttpError && err.data && typeof err.data === "object") {
        const details = (err.data as Record<string, unknown>).message;
        setErrorMessage(
          typeof details === "string" ? details : "Gagal memperbarui kata sandi. Coba lagi.",
        );
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi sesaat lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-6 w-full max-w-md bg-white p-6 text-center">
        <HiCheckBadge size={80} className="mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold text-primary">Reset Kata Sandi Berhasil</h1>
        <p className="mt-2 text-gray-600">
          Silakan masuk menggunakan kata sandi baru Anda.
        </p>
        <Link
          href={`/${lang}/auth/login`}
          className="mt-6 inline-block w-full rounded bg-primary p-[10px] text-white transition hover:bg-[#04264b]"
        >
          Masuk
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 ${jakartaSans.className}`}
    >
      <h1 className="text-2xl font-bold text-center text-primary">
        Buat Kata Sandi Baru
      </h1>

      {maskedEmail ? (
        <p className="text-center text-sm text-gray-600">
          Mengatur ulang kata sandi untuk <span className="font-semibold">{maskedEmail}</span>
        </p>
      ) : (
        <p className="text-center text-sm text-red-600">
          Tautan reset tidak memiliki email. Silakan minta tautan baru.
        </p>
      )}

      <div>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Kata sandi wajib diisi",
            minLength: {
              value: 8,
              message: "Kata sandi minimal 8 karakter",
            },
          }}
          render={({ field }) => (
            <InputPassword placeholder="Kata sandi baru" {...field} />
          )}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Konfirmasi kata sandi wajib diisi",
            validate: (value) =>
              value === watch("password") || "Konfirmasi kata sandi tidak sama",
          }}
          render={({ field }) => (
            <InputPassword placeholder="Konfirmasi kata sandi" {...field} />
          )}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-primary p-[10px] text-white transition hover:bg-[#04264b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Memproses..." : "Perbarui kata sandi"}
      </button>
    </form>
  );
}
