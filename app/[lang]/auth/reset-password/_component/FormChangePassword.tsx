"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { HiCheckBadge } from "react-icons/hi2";
import { Plus_Jakarta_Sans } from "next/font/google";
import InputPassword from "@/components/ui-custom/form/InputPassword";
import Link from "next/link";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type FormValues = {
  password: string;
  confirmPassword: string;
};

function FormChangePassword() {
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

  const [success, setSuccess] = useState(false);

  const onSubmit = (data: FormValues) => {
    console.log("Form submit data:", data);
    if (data.password === data.confirmPassword) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-white mx-6 p-6 text-center">
        <HiCheckBadge size={80} className="mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold mb-6 text-primary">
          Reset Kata Sandi Berhasil
        </h1>
        <Link
          href="/login"
          className="inline-block w-full bg-primary text-white p-[10px] rounded hover:bg-[#3a00b8] transition"
        >
          Masuk
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 font-['Plus_Jakarta_Sans']`}
    >
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Buat Kata Sandi Baru
      </h1>

      {/* Password */}
      <div>
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Kata sandi wajib diisi",
            minLength: {
              value: 6,
              message: "Kata sandi minimal 6 karakter",
            },
          }}
          render={({ field }) => (
            <InputPassword placeholder="Kata sandi baru" {...field} />
          )}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Konfirmasi kata sandi wajib diisi",
            validate: (value) =>
              value === watch("password") || "Konfirmasi tidak sama",
          }}
          render={({ field }) => (
            <InputPassword placeholder="Konfirmasi kata sandi" {...field} />
          )}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white p-[10px] rounded hover:bg-[#3a00b8] transition"
      >
        Lanjutkan
      </button>
    </form>
  );
}

export default FormChangePassword;
