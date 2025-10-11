"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { createPortal } from "react-dom";

import { ProfileService } from "@/services/profile.service";
import { ApiError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import type { getDictionaryProfile } from "@/dictionaries/profile/get-dictionary-profile";

type PasswordFormValues = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

type ProfileDictionary = Awaited<ReturnType<typeof getDictionaryProfile>>;

type ProfileFormPasswordProps = {
  dictionary: ProfileDictionary;
};

const MIN_PASSWORD_LENGTH = 8;

export default function ProfileFormChangePassword({ dictionary }: ProfileFormPasswordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const { buttons, messages, validation, passwordModal } = dictionary;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });
  const newPasswordValue = watch("new_password");
  const confirmPasswordValue = watch("new_password_confirmation");
  const hasTypedConfirmation = confirmPasswordValue.length > 0;
  const passwordsMatch =
    !hasTypedConfirmation || newPasswordValue === confirmPasswordValue;

  const mutation = useMutation({
    mutationFn: ProfileService.changePassword,
    onSuccess: () => {
      toast.success(messages.passwordChanged);
    },
  });

  const handleOpen = () => {
    reset({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setFormMessage(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormMessage(null);

    try {
      await mutation.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password_confirmation,
      });

      closeModal();
    } catch (error) {
      let fallback = messages.passwordChangeError;

      if (error instanceof ApiError) {
        const body = error.body;

        if (body && typeof body === "object") {
          if ("fields" in body && body.fields && typeof body.fields === "object") {
            const fields = body.fields as Record<string, unknown>;

            if (fields.current_password && typeof fields.current_password === "string") {
              setError("current_password", {
                type: "server",
                message: fields.current_password,
              });
            }
            if (fields.new_password && typeof fields.new_password === "string") {
              setError("new_password", {
                type: "server",
                message: fields.new_password,
              });
            }
            if (
              fields.new_password_confirmation &&
              typeof fields.new_password_confirmation === "string"
            ) {
              setError("new_password_confirmation", {
                type: "server",
                message: fields.new_password_confirmation,
              });
            }
          }

          if ("code" in body && body.code === "password_incorrect") {
            setError("current_password", {
              type: "server",
              message:
                (typeof body.message === "string" && body.message) ||
                messages.passwordIncorrect,
            });
          }

          if ("message" in body && typeof body.message === "string" && body.message.trim()) {
            fallback = body.message;
          }
        } else if (typeof error.message === "string" && error.message.trim()) {
          fallback = error.message;
        }
      }

      setFormMessage(fallback);
      toast.error(fallback);
    }
  });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center gap-2 border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition w-full lg:w-auto"
      >
        <FaKey /> {buttons.changePassword}
      </button>

      {isMounted && isOpen
        ? createPortal(
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 className="text-xl font-semibold text-center text-primary mb-4">
                  {passwordModal.title}
                </h2>

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {passwordModal.current}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        autoComplete="current-password"
                        {...register("current_password", { required: validation.passwordRequired })}
                        className="w-full border rounded px-3 py-2 focus:outline-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, current: !prev.current }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.current_password ? (
                      <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {passwordModal.new}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        autoComplete="new-password"
                        {...register("new_password", {
                          required: validation.newPasswordRequired,
                          minLength: {
                            value: MIN_PASSWORD_LENGTH,
                            message: validation.newPasswordMin,
                          },
                        })}
                        className="w-full border rounded px-3 py-2 focus:outline-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.new_password ? (
                      <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {passwordModal.confirm}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        autoComplete="new-password"
                        {...register("new_password_confirmation", {
                          required: validation.confirmPasswordRequired,
                          validate: (value, formValues) =>
                            value === formValues.new_password || validation.passwordConfirm,
                        })}
                        className="w-full border rounded px-3 py-2 focus:outline-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.new_password_confirmation ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.new_password_confirmation.message}
                      </p>
                    ) : hasTypedConfirmation ? (
                      <p
                        className={`text-xs mt-1 ${
                          passwordsMatch ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {passwordsMatch ? messages.passwordMatch : validation.passwordConfirm}
                      </p>
                    ) : null}
                  </div>

                  {formMessage ? (
                    <p className="text-sm text-red-600">{formMessage}</p>
                  ) : null}

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? passwordModal.saving : passwordModal.submit}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
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
    </>
  );
}
