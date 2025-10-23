// app/[lang]/auth/register/page.tsx
import { Suspense } from "react";
import Image from "next/image";
import FormRegister from "./_component/FormRegister"; // ✅ tambahkan import ini
import type { PagePropsP, LangParamsP } from "@/types/next"; // ✅ pakai versi Promise
import { getDictionary } from "@/dictionaries/get-dictionary";

type RegisterDict = typeof defaultRegisterDict.en;

const supportedLangs = ["id", "en"] as const;
type LangKey = (typeof supportedLangs)[number];
function isLang(x: string): x is LangKey {
  return (supportedLangs as readonly string[]).includes(x);
}

// 🔧 util deep-merge khusus struktur RegisterDict
function normalizeDict(base: RegisterDict, override?: Partial<RegisterDict>): RegisterDict {
  const o = override || {};
  return {
    title: o.title ?? base.title,
    placeholders: { ...base.placeholders, ...(o.placeholders ?? {}) },
    button: { ...base.button, ...(o.button ?? {}) },
    links: { ...base.links, ...(o.links ?? {}) },
    messages: { ...base.messages, ...(o.messages ?? {}) },
    validation: { ...base.validation, ...(o.validation ?? {}) },
  };
}

export default async function Register({ params }: PagePropsP<LangParamsP>) {
  const { lang } = await params; // ✅ Next 15: params harus di-await
  const safeLang: LangKey = isLang(lang) ? lang : "en";

  // Ambil dict dari i18n (boleh partial)
  const rootDict = await getDictionary(safeLang).catch(() => ({} as any));

  // Ambil namespace yang mungkin kamu punya (boleh partial)
  const override = (rootDict?.auth?.register ?? rootDict?.register) as Partial<RegisterDict> | undefined;

  // ✅ Deep-merge: pastikan setiap key ada
  const dict: RegisterDict = normalizeDict(defaultRegisterDict[safeLang], override);

  return (
    <div className="flex h-screen">
      {/* Kolom kiri - Gambar Full */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/assets/images/auth/auth.webp"
          alt="Tygo School"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Kolom kanan - Form Register */}
      <div className="flex flex-col flex-1 bg-[#F5F5F5] items-center justify-center p-8 space-y-[40px]">
        <div className="flex items-center text-[#003663] gap-2">
          <span
            aria-hidden="true"
            className="block shrink-0 w-12 h-12 bg-[#003663]
              [mask-image:url('/assets/logo-dmd-vector.svg')]
              [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]
              [-webkit-mask-image:url('/assets/logo-dmd-vector.svg')]
              [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
          />
          <div className="font-bold text-[28px] leading-[1.1]">
            DMD Shoeparts
            <br />
            Manufacturing
          </div>
        </div>

        <div className="w-full max-w-md bg-white mx-6 p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">
            {dict.title}
          </h1>

          {/* ✅ dict sudah normalized */}
          <Suspense fallback={null}>
            <FormRegister dict={dict} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const defaultRegisterDict: Record<
  "en" | "id",
  {
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
    messages: { genericError: string; success: string };
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
  }
> = {
  en: {
    title: "Register",
    placeholders: {
      name: "Name",
      email: "Email",
      phone: "Phone Number",
      password: "Password",
      password_confirmation: "Confirm Password",
    },
    button: { submit: "Register" },
    links: { haveAccount: "Already have an account?", login: "Login" },
    messages: {
      genericError: "Registration failed. Please check your inputs.",
      success: "Registered successfully. Please verify your email.",
    },
    validation: {
      name_required: "Name is required.",
      email_required: "Email is required.",
      email_invalid: "Email is not valid.",
      password_required: "Password is required.",
      password_min: "Password must be at least 8 characters long.",
      password_confirmation_required: "Password confirmation is required.",
      password_mismatch: "Passwords do not match.",
      phone_required: "Phone is required.",
      phone_invalid: "Phone must be in E.164 format (e.g. +62812...).",
      form_invalid: "Please review your inputs.",
    },
  },
  id: {
    title: "Daftar",
    placeholders: {
      name: "Nama",
      email: "Email",
      phone: "Nomor Telepon",
      password: "Kata Sandi",
      password_confirmation: "Konfirmasi Kata Sandi",
    },
    button: { submit: "Daftar" },
    links: { haveAccount: "Sudah punya akun?", login: "Masuk" },
    messages: {
      genericError: "Registrasi gagal. Silakan periksa data yang dimasukkan.",
      success: "Registrasi berhasil. Silakan verifikasi email Anda.",
    },
    validation: {
      name_required: "Nama wajib diisi.",
      email_required: "Email wajib diisi.",
      email_invalid: "Email tidak valid.",
      password_required: "Kata sandi wajib diisi.",
      password_min: "Kata sandi minimal 8 karakter.",
      password_confirmation_required: "Konfirmasi kata sandi wajib diisi.",
      password_mismatch: "Kata sandi tidak sama.",
      phone_required: "Nomor telepon wajib diisi.",
      phone_invalid: "Nomor telepon harus format E.164 (contoh +62812...).",
      form_invalid: "Periksa kembali data yang kamu isi.",
    },
  },
};
