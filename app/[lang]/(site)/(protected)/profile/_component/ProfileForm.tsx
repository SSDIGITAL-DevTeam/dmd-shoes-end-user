"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { ProfileService } from "@/services/profile.service";
import { ApiError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import ProfileFormEmail from "./ProfileFormEmail";
import ProfileFormChangePassword from "./ProfileFormPassword";
import type { getDictionaryProfile } from "@/dictionaries/profile/get-dictionary-profile";
import { useAuthStore } from "@/store/auth-store";
import { getStoredToken } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";

type ProfileFormValues = {
  full_name: string;
  whatsapp_e164: string;
};

type ProfileDictionary = Awaited<ReturnType<typeof getDictionaryProfile>>;

type ProfileFormProps = {
  dictionary: ProfileDictionary;
};

const whatsappPattern = /^\+\d{8,15}$/;

const normalizeName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);

export default function ProfileForm({ dictionary }: ProfileFormProps) {
  const { user, isFetchingUser, refetchUser } = useAuth();
  const { token: authToken, setAuth } = useAuthStore((state) => ({
    token: state.token,
    setAuth: state.setAuth,
  }));
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [hasRenderedToast, setHasRenderedToast] = useState(false);
  const { labels, placeholders, buttons, badge, messages, validation } = dictionary;

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: "",
      whatsapp_e164: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      full_name: normalizeName(user.full_name ?? user.name ?? ""),
      whatsapp_e164: user.whatsapp_e164 ?? user.phone ?? "",
    });
  }, [user, reset]);

  useEffect(() => {
    if (!searchParams) return;
    const status = searchParams.get("email-verified");
    if (!status || hasRenderedToast) return;

    const message = searchParams.get("message") ?? undefined;

    if (status === "email_verified") {
      toast.success(message ?? messages.emailVerified);
      refetchUser().catch(() => {
        // ignore refetch errors here; handled elsewhere if needed
      });
    } else if (status === "email_already_verified") {
      toast.info(message ?? messages.emailAlreadyVerified);
    } else {
      toast.error(message ?? messages.emailInvalid);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("email-verified");
    params.delete("message");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    setHasRenderedToast(true);
  }, [searchParams, router, pathname, refetchUser, hasRenderedToast]);

  useEffect(() => {
    if (!searchParams?.has("email-verified")) {
      setHasRenderedToast(false);
    }
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: ProfileService.updateProfile,
    onSuccess: async (_response, variables) => {
      toast.success(messages.profileSaved);

      let updatedUser = await refetchUser();

      if (!updatedUser && user) {
        const normalizedFullName = normalizeName(variables.full_name);
        updatedUser = {
          ...user,
          full_name: normalizedFullName,
          name: normalizedFullName,
          whatsapp_e164: variables.whatsapp_e164 ?? null,
          phone: variables.whatsapp_e164 ?? null,
        };
      }

      if (updatedUser) {
        queryClient.setQueryData(queryKeys.auth.me, updatedUser);
        setAuth({
          token: getStoredToken() ?? authToken ?? null,
          user: updatedUser,
        });
        reset({
          full_name: normalizeName(updatedUser.full_name ?? updatedUser.name ?? ""),
          whatsapp_e164: updatedUser.whatsapp_e164 ?? updatedUser.phone ?? "",
        });
      }
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      full_name: normalizeName(values.full_name),
      whatsapp_e164: values.whatsapp_e164 ? values.whatsapp_e164 : null,
    };

    try {
      await mutation.mutateAsync(payload);
    } catch (error) {
      let fallback = messages.profileSaveError;

      if (error instanceof ApiError) {
        const body = error.body;

        if (body && typeof body === "object") {
          if ("fields" in body && body.fields && typeof body.fields === "object") {
            const fields = body.fields as Record<string, unknown>;
            if (fields.full_name && typeof fields.full_name === "string") {
              setError("full_name", { type: "server", message: fields.full_name });
            }
            if (fields.whatsapp_e164 && typeof fields.whatsapp_e164 === "string") {
              setError("whatsapp_e164", { type: "server", message: fields.whatsapp_e164 });
            }
          }

          if (typeof body.message === "string" && body.message.trim()) {
            fallback = body.message;
          }
        } else if (typeof error.message === "string" && error.message.trim()) {
          fallback = error.message;
        }
      }

      toast.error(fallback);
    }
  });

  const isSaving = mutation.isPending;

  const email = user?.email ?? "";
  const emailVerified = Boolean(user?.email_verified);
  const pendingEmail = user?.pending_email ?? null;
  const pendingEmailParts = useMemo(
    () => labels.pendingEmail.split("{{email}}"),
    [labels.pendingEmail],
  );

  const verificationBadge = useMemo(() => {
    if (!email) return null;
    const badgeClass = emailVerified
      ? "bg-green-50 text-green-700 border border-green-200"
      : "bg-amber-50 text-amber-700 border border-amber-200";
    const label = emailVerified ? badge.verified : badge.unverified;

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
        {label}
      </span>
    );
  }, [email, emailVerified, badge]);

  const nameField = register("full_name", {
    required: validation.fullNameRequired,
    minLength: {
      value: 2,
      message: validation.fullNameMin,
    },
    maxLength: {
      value: 80,
      message: validation.fullNameMax,
    },
    validate: (value) => {
      const normalized = normalizeName(value);
      if (normalized.length < 2) return validation.fullNameMin;
      if (!/[A-Za-z\u00C0-\u024F]/.test(normalized)) {
        return validation.fullNameAlpha;
      }
      return true;
    },
  });

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-20 w-full animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
      <div className="h-12 w-40 animate-pulse rounded-md bg-gray-100" />
    </div>
  );

  if (isFetchingUser && !user) {
    return renderSkeleton();
  }

  if (!user) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">{messages.profileLoadError}</p>
        <button
          type="button"
          onClick={() => {
            refetchUser().catch(() => {
              toast.error(messages.profileLoadError);
            });
          }}
          className="mt-3 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          {buttons.retry}
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6 w-full" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-primary font-medium mb-2">{labels.fullName}</label>
          <input
            {...nameField}
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-primary w-full"
            placeholder={placeholders.fullName}
            autoComplete="name"
          />
          {errors.full_name && (
            <span className="text-red-500 text-sm mt-1">{errors.full_name.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-primary font-medium mb-2 flex items-center gap-2">
            <span>{labels.email}</span>
            {verificationBadge}
          </label>
          <input
            value={email}
            readOnly
            className="border border-gray-300 rounded p-3 bg-gray-100 text-gray-700 w-full"
          />
          {pendingEmail ? (
            <p className="mt-2 text-sm text-amber-700">
              {pendingEmailParts[0]}
              <span className="font-semibold">{pendingEmail}</span>
              {pendingEmailParts[1] ?? ""}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-primary font-medium mb-2">{labels.whatsapp}</label>
          <Controller
            name="whatsapp_e164"
            control={control}
            rules={{
              validate: (value) => {
                if (!value) return true;
                return whatsappPattern.test(value)
                  ? true
                  : validation.whatsappFormat;
              },
            }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                value={field.value || ""}
                placeholder={placeholders.whatsapp}
                defaultCountry="ID"
                international
                countryCallingCodeEditable={false}
                className="profile-phone w-full"
                onChange={(value) => field.onChange(value ?? "")}
              />
            )}
          />
          {errors.whatsapp_e164 && (
            <span className="text-red-500 text-sm mt-1">{errors.whatsapp_e164.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-6 gap-4">
        <div className="flex flex-col lg:flex-row flex-wrap gap-4 w-full lg:w-auto">
          <ProfileFormEmail dictionary={dictionary} />
          <ProfileFormChangePassword dictionary={dictionary} />
        </div>

        <div className="w-full lg:w-auto">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 transition w-full lg:w-auto disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving || !isDirty}
          >
            {isSaving ? buttons.saving : buttons.save}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .profile-phone {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .profile-phone input {
          flex: 1;
          min-width: 0;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          outline: none;
          transition: 0.2s;
        }
        .profile-phone input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4);
        }
        .profile-phone .PhoneInputCountry {
          margin-right: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          background: white;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .profile-phone .PhoneInputCountrySelect {
          outline: none;
        }
      `}</style>
    </form>
  );
}
