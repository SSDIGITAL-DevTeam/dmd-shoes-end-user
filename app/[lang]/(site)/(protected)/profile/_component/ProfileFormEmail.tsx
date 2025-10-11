"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMailOpenOutline } from "react-icons/io5";
import { BiChevronLeft } from "react-icons/bi";
import { createPortal } from "react-dom";

import { useAuth } from "@/hooks/useAuth";
import { ProfileService } from "@/services/profile.service";
import { ApiError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import type { getDictionaryProfile } from "@/dictionaries/profile/get-dictionary-profile";
import { queryKeys } from "@/lib/query-keys";
import { getStoredToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

type EmailFormValues = {
  current_password: string;
  new_email: string;
};

type ProfileDictionary = Awaited<ReturnType<typeof getDictionaryProfile>>;

type ProfileFormEmailProps = {
  dictionary: ProfileDictionary;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_COOLDOWN = 60;

const formatTemplate = (
  template: string,
  replacements: Record<string, string | number>,
) => template.replace(/{{(\w+)}}/g, (_, key) => String(replacements[key] ?? ""));

async function syncAuth(
  refetchUser: () => Promise<any>,
  queryClient: ReturnType<typeof useQueryClient>,
  setAuth: (v: { token: string | null; user: any | null }) => void,
  token: string | null,
) {
  const freshUser = await refetchUser();
  if (freshUser) {
    queryClient.setQueryData(queryKeys.auth.me, freshUser);
    setAuth({ token, user: freshUser });
  }
}

export default function ProfileFormEmail({ dictionary }: ProfileFormEmailProps) {
  const { user, refetchUser } = useAuth();

  const { token, setAuth } = useAuthStore((s) => ({
    token: s.token,
    setAuth: s.setAuth,
  }));

  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const { buttons, messages, validation, emailModal, placeholders } = dictionary;
  const successBodyParts = useMemo(
    () => emailModal.successBody.split("{{email}}"),
    [emailModal.successBody],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EmailFormValues>({
    defaultValues: {
      current_password: "",
      new_email: "",
    },
  });

  const targetEmail = useMemo(
    () => submittedEmail ?? user?.pending_email ?? "",
    [submittedEmail, user],
  );

  // Request change email
  const requestMutation = useMutation({
    mutationFn: ProfileService.requestEmailChange,
    onSuccess: async (_resp, variables) => {
      // Sukses request: tampilkan modal sukses dan set cooldown
      setSubmittedEmail(variables.new_email.trim());
      setOpenModal(false);
      setSuccessModal(true);
      setCooldown(DEFAULT_COOLDOWN);
      toast.info(messages.emailChangeRequested);
    },
    onSettled: async () => {
      await syncAuth(refetchUser, queryClient, setAuth, getStoredToken() ?? token ?? null);
    },
    onError: (error) => {
      let fallback = messages.emailChangeError;
      let hasFieldError = false;

      if (error instanceof ApiError) {
        const body = error.body;

        if (body && typeof body === "object") {
          // Field-level
          if ("fields" in body && (body as any).fields && typeof (body as any).fields === "object") {
            const fields = (body as any).fields as Record<string, unknown>;
            if (typeof fields.current_password === "string") {
              hasFieldError = true;
              setError("current_password", { type: "server", message: fields.current_password });
            }
            if (typeof fields.new_email === "string") {
              hasFieldError = true;
              setError("new_email", { type: "server", message: fields.new_email });
            }
          }

          if ((body as any).code === "password_incorrect") {
            hasFieldError = true;
            setError("current_password", {
              type: "server",
              message:
                (typeof (body as any).message === "string" && (body as any).message) ||
                messages.passwordIncorrect,
            });
          }

          if ((body as any).code === "email_taken") {
            hasFieldError = true;
            setError("new_email", {
              type: "server",
              message:
                (typeof (body as any).message === "string" && (body as any).message) ||
                validation.emailDifferent,
            });
          }

          if (typeof (body as any).message === "string" && (body as any).message.trim()) {
            fallback = (body as any).message;
          }
        } else if (typeof error.message === "string" && error.message.trim()) {
          fallback = error.message;
        }
      }

      setFormMessage(hasFieldError ? null : fallback);
      toast.error(fallback);
    },
  });

  // Resend verification
  const resendMutation = useMutation({
    mutationFn: (payload: { new_email?: string | null }) =>
      ProfileService.resendEmailVerification(payload),
    onSuccess: async () => {
      toast.success(messages.emailResent);
      setCooldown(DEFAULT_COOLDOWN);
      await syncAuth(refetchUser, queryClient, setAuth, getStoredToken() ?? token ?? null);
    },
    onError: (error) => {
      let fallback = messages.emailResendError;
      if (error instanceof ApiError) {
        const body = error.body;
        if (body && typeof body === "object") {
          if ("retry_after" in body && typeof (body as any).retry_after === "number") {
            setCooldown(Math.max(1, Math.round((body as any).retry_after)));
          }
          if (typeof (body as any).message === "string" && (body as any).message.trim()) {
            fallback = (body as any).message;
          }
        } else if (typeof error.message === "string" && error.message.trim()) {
          fallback = error.message;
        }
      }
      toast.error(fallback);
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleOpen = () => {
    reset({ current_password: "", new_email: "" });
    setFormMessage(null);
    setOpenModal(true);
  };

  const closeAll = () => {
    setOpenModal(false);
    setSuccessModal(false);
    setShowPassword(false);
  };

  const handleSubmitForm = handleSubmit(async (values) => {
    setFormMessage(null);
    await requestMutation.mutateAsync({
      current_password: values.current_password,
      new_email: values.new_email.trim(),
      idempotencyKey: (() => {
        if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
          try {
            return crypto.randomUUID();
          } catch {
            /* ignore */
          }
        }
        return `email-change-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      })(),
    });
  });

  const handleResend = useCallback(async () => {
    if (!targetEmail || cooldown > 0 || resendMutation.isPending) return;
    await resendMutation.mutateAsync({ new_email: targetEmail });
  }, [cooldown, resendMutation, targetEmail]);

  const renderModal = () => (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 px-4"
      onClick={closeAll}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center text-xl font-semibold text-primary">
          {emailModal.title}
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmitForm}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#121212]">
              {emailModal.passwordLabel}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("current_password", { required: validation.passwordRequired })}
                className="w-full rounded border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.current_password ? (
              <p className="mt-1 text-sm text-red-600">{errors.current_password.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#121212]">
              {emailModal.emailLabel}
            </label>
            <input
              type="email"
              autoComplete="email"
              {...register("new_email", {
                required: validation.emailRequired,
                pattern: { value: EMAIL_REGEX, message: validation.emailFormat },
                validate: (value) => {
                  if (user?.email && value.trim().toLowerCase() === user.email.toLowerCase()) {
                    return validation.emailDifferent;
                  }
                  return true;
                },
              })}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={placeholders.email}
            />
            {errors.new_email ? (
              <p className="mt-1 text-sm text-red-600">{errors.new_email.message}</p>
            ) : null}
          </div>

          {formMessage ? <p className="text-sm text-red-600">{formMessage}</p> : null}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white transition hover:bg-primary/90 disabled:opacity-60"
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending ? emailModal.submitting : emailModal.submit}
            </button>
            <button
              type="button"
              onClick={closeAll}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              {buttons.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 px-4"
      onClick={closeAll}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 text-center shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeAll}
          className="absolute left-4 top-4 flex items-center text-sm text-gray-500 hover:underline"
        >
          <BiChevronLeft /> {buttons.close}
        </button>

        <IoMailOpenOutline className="mx-auto mb-4 text-5xl text-primary" />

        <h2 className="text-xl font-semibold text-primary">{emailModal.successTitle}</h2>
        <p className="mt-3 text-sm text-gray-700">
          {successBodyParts[0]}
          <span className="font-semibold">{targetEmail}</span>
          {successBodyParts[1] ?? ""}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {emailModal.resendPrompt}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resendMutation.isPending}
            className="ml-1 font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resendMutation.isPending
              ? emailModal.resending
              : cooldown > 0
                ? formatTemplate(emailModal.resendCooldown, { seconds: cooldown })
                : emailModal.resendLink}
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center gap-2 rounded border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        disabled={requestMutation.isPending}
      >
        <FaEnvelope /> {buttons.changeEmail}
      </button>

      {isMounted && openModal ? createPortal(renderModal(), document.body) : null}
      {isMounted && successModal ? createPortal(renderSuccess(), document.body) : null}
    </>
  );
}
