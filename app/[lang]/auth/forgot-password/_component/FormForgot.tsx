"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthService } from "@/services/auth.service";
import { authDict, type AuthLang } from "@/dictionaries/auth/auth-forgot-password";

const jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type FormValues = { email: string };

function getLaravelError(err: any): string | null {
  // Bias ke pesan validasi Laravel
  const msg =
    err?.data?.errors?.email?.[0] ??
    err?.data?.message ??
    err?.message ??
    null;
  return typeof msg === "string" ? msg : null;
}

export default function FormForgot({ lang = "id" as AuthLang }: { lang?: AuthLang }) {
  const dict = authDict[lang] ?? authDict.id;

  const { register, handleSubmit } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // resend cooldown
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = async (data: FormValues) => {
    setMsg(null);
    setLoading(true);
    try {
      setEmail(data.email);
      await AuthService.forgotPassword({ email: data.email }, lang);
      setSubmitted(true);
      setMsg({ type: "ok", text: dict.okSent });
      setCooldown(60);
    } catch (err: any) {
      setMsg({ type: "err", text: getLaravelError(err) ?? dict.failSend });
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setMsg(null);
    setLoading(true);
    try {
      await AuthService.resendVerification({ email }, lang);
      setMsg({ type: "ok", text: dict.okResent });
      setCooldown(60);
    } catch (err: any) {
      if (err?.status === 429) {
        setMsg({ type: "err", text: dict.tooMany });
        setCooldown(60);
      } else {
        setMsg({ type: "err", text: getLaravelError(err) ?? dict.failResend });
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`space-y-6 ${jakartaSans.className}`}>
        <h1 className="text-2xl font-bold text-center text-primary">{dict.sentTitle}</h1>
        <p className="text-center text-[18px]">{dict.sentDesc(email)}</p>

        <button
          type="button"
          onClick={onResend}
          disabled={loading || cooldown > 0}
          className="w-full bg-primary text-white p-3 rounded disabled:opacity-70"
        >
          {loading ? dict.processing : cooldown > 0 ? dict.resendCountdown(cooldown) : dict.resend}
        </button>

        {msg && (
          <p className={`text-sm ${msg.type === "ok" ? "text-green-600" : "text-red-600"}`}>{msg.text}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${jakartaSans.className}`}>
      <h1 className="text-2xl font-bold text-center text-primary">{dict.title}</h1>
      <p className="text-center text-[18px]">{dict.subtitle}</p>

      <input
        type="email"
        {...register("email", { required: true })}
        className="w-full text-[#121212]/75 text-[18px] border-b border-[#1212124D] px-3 py-2 focus:outline-none focus:border-blue-500"
        placeholder={dict.emailPlaceholder}
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white p-3 rounded disabled:opacity-70"
      >
        {loading ? dict.processing : dict.submit}
      </button>

      {msg && <p className={`text-sm ${msg.type === "ok" ? "text-green-600" : "text-red-600"}`}>{msg.text}</p>}
    </form>
  );
}
