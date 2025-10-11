"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
import { useAuthStore } from "@/store/auth-store";
import { queryKeys } from "@/lib/query-keys";
import { getStoredToken } from "@/lib/auth";

type EmailFormValues = {
  current_password: string;
  new_email: string;
};

type ProfileDictionary = Awaited<ReturnType<typeof getDictionaryProfile>>;

type ProfileFormEmailProps = {
  dictionary: ProfileDictionary;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_RESEND_COOLDOWN = 60;

const generateIdempotencyKey = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      // ignore and fallback
    }
  }
  return `email-change-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const formatTemplate = (
  template: string,
  replacements: Record<string, string | number>,
) => template.replace(/{{(\w+)}}/g, (_, key) => String(replacements[key] ?? ""));

export default function ProfileFormEmail({ dictionary }: ProfileFormEmailProps) {
  const { user, refetchUser } = useAuth();
  const { token: authToken, setAuth } = useAuthStore((state) => ({
    token: state.token,
    setAuth: state.setAuth,
  }));
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const targetEmail = useMemo(
    () => submittedEmail ?? user?.pending_email ?? "",
    [submittedEmail, user],
  );

  const { buttons, messages, validation, emailModal, placeholders } = dictionary;
  const successBodyParts = useMemo(
    () => emailModal.successBody.split("{{email}}"),
    [emailModal.successBody],
  );
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const requestMutation = useMutation({
    mutationFn: ProfileService.requestEmailChange,
    onSettled: async () => {
      const freshUser = await refetchUser();
      if (freshUser) {
        queryClient.setQueryData(queryKeys.auth.me, freshUser);
        setAuth({ token: getStoredToken() ?? authToken ?? null, user: freshUser });
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: ProfileService.resendEmailVerification,
    onSuccess: async () => {
      toast.success(messages.emailResent);
      setCooldown(DEFAULT_RESEND_COOLDOWN);
      const freshUser = await refetchUser();
      if (freshUser) {
        queryClient.setQueryData(queryKeys.auth.me, freshUser);
        setAuth({ token: getStoredToken() ?? authToken ?? null, user: freshUser });
      }
    },
  });

  const onResend = useCallback(async () => {
    // cegah klik beruntun / saat cooldown
    if (cooldown > 0 || resendMutation.isPending) return;

    try {
      await resendMutation.mutateAsync({ new_email: targetEmail }); // ProfileService.resendEmailVerification
      // sukses: toast & reset cooldown sudah di onSuccess, tapi tak apa kita jaga-jaga
      setCooldown((v) => (v > 0 ? v : DEFAULT_RESEND_COOLDOWN));
    } catch (err) {
      // fallback message
        toast.error(
        (messages as any)?.emailResendError ??
        "Gagal mengirim ulang email verifikasi. Coba lagi sebentar."
      );
      }
    }, [cooldown, resendMutation, messages, targetEmail]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const handleOpen = () => {
    reset({
      current_password: "",
      new_email: "",
    });
    setFormMessage(null);
    setOpenModal(true);
  };

  const closeModals = () => {
    setOpenModal(false);
    setSuccessModal(false);
    setShowPassword(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormMessage(null);

    const idempotencyKey = generateIdempotencyKey();

    try {
      await requestMutation.mutateAsync({
        current_password: values.current_password,
        new_email: values.new_email.trim(),
        idempotencyKey,
      });

      setSubmittedEmail(values.new_email.trim());
      setOpenModal(false);
      setSuccessModal(true);
      setCooldown(DEFAULT_RESEND_COOLDOWN);
      toast.info(messages.emailChangeRequested);
    } catch (error) {
      let fallback = messages.emailChangeError;
      let hasFieldLevelError = false;

      if (error instanceof ApiError) {
        const body = error.body;

        if (body && typeof body === "object") {
          if ("fields" in body && body.fields && typeof body.fields === "object") {
            const fields = body.fields as Record<string, unknown>;
            if (fields.current_password && typeof fields.current_password === "string") {
              hasFieldLevelError = true;
              setError("current_password", { type: "server", message: fields.current_password });
            }
            if (fields.new_email && typeof fields.new_email === "string") {
              hasFieldLevelError = true;
              setError("new_email", { type: "server", message: fields.new_email });
            }
          }

          if ("code" in body && body.code === "password_incorrect") {
            hasFieldLevelError = true;
            setError("current_password", {
              type: "server",
              message:
                (typeof body.message === "string" && body.message) ||
                messages.passwordIncorrect,
            });
          }

          if ("code" in body && body.code === "email_taken") {
            hasFieldLevelError = true;
            setError("new_email", {
              type: "server",
              message:
                (typeof body.message === "string" && body.message) ||
                validation.emailDifferent,
            });
          }

          if ("message" in body && typeof body.message === "string" && body.message.trim()) {
            fallback = body.message;
          }
        } else if (typeof error.message === "string" && error.message.trim()) {
          fallback = error.message;
        }
      }

      setFormMessage(hasFieldLevelError ? null : fallback);
      toast.error(fallback);
    }
  });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center gap-2 border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition w-full lg:w-auto"
        disabled={requestMutation.isPending}
      >
        <FaEnvelope /> {buttons.changeEmail}
      </button>

      {isMounted && openModal
        ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={closeModals}
          >
            <div
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-center text-xl font-semibold mb-4 text-primary">
                {emailModal.title}
              </h2>

              <form className="space-y-4" onSubmit={onSubmit}>
                <label className="block text-sm mb-1 text-[16px] leading-[150%]">
                  {emailModal.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("current_password", { required: validation.passwordRequired })}
                    className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.current_password ? (
                  <p className="text-red-500 text-sm">{errors.current_password.message}</p>
                ) : null}

                <label className="block text-sm mb-1 text-[16px] leading-[150%]">
                  {emailModal.emailLabel}
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register("new_email", {
                    required: validation.emailRequired,
                    pattern: {
                      value: EMAIL_REGEX,
                      message: validation.emailFormat,
                    },
                    validate: (value) => {
                      if (value && user?.email && value.trim().toLowerCase() === user.email.toLowerCase()) {
                        return validation.emailDifferent;
                      }
                      return true;
                    },
                  })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={placeholders.email}
                />
                {errors.new_email ? (
                  <p className="text-red-500 text-sm">{errors.new_email.message}</p>
                ) : null}

                {formMessage ? (
                  <p className="text-sm text-red-600">{formMessage}</p>
                ) : null}

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={requestMutation.isPending}
                  >
                    {requestMutation.isPending ? emailModal.submitting : emailModal.submit}
                  </button>
                  <button
                    type="button"
                    onClick={closeModals}
                    className="w-full rounded border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {buttons.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )
        : null}

      {isMounted && successModal
        ? createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={closeModals}
          >
            <div
              className="relative w-full max-w-md rounded-xl bg-white p-6 text-center shadow-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModals}
                className="absolute top-4 left-4 text-sm text-gray-500 flex items-center gap-1 hover:underline"
              >
                <BiChevronLeft /> {buttons.close}
              </button>

              <IoMailOpenOutline className="text-primary text-5xl mx-auto mb-4" />

              <h2 className="text-xl font-semibold mb-2 text-primary">
                {emailModal.successTitle}
              </h2>
              <p className="text-gray-700 mb-3">
                {successBodyParts[0]}
                <span className="font-semibold">{targetEmail}</span>
                {successBodyParts[1] ?? ""}
              </p>
              <p className="text-gray-600 text-sm">
                {emailModal.resendPrompt}
                <button
                  type="button"
                  onClick={onResend}
                  className="text-primary font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={cooldown > 0 || resendMutation.isPending}
                >
                  {resendMutation.isPending
                    ? emailModal.resending
                    : cooldown > 0
                      ? formatTemplate(emailModal.resendCooldown, { seconds: cooldown })
                      : emailModal.resendLink}
                </button>
              </p>
            </div>
          </div>,
          document.body,
        )
        : null}
    </>
  );
}



