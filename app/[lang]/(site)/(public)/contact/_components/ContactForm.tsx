"use client";

import { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Container from "@/components/ui-custom/Container";
import { plusJakartaSans } from "@/config/font";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/app/[lang]/config/contact";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
  display: "swap",
});

type FormState = {
  name: string;
  email: string;
  whatsapp: string | undefined;
  message: string;
};

type Props = {
  dictionaryContact: any;
  lang?: string; // opsional
};

export default function ContactForm({ dictionaryContact, lang }: Props) {
  const pathname = usePathname();
  const locale = (lang || pathname?.split("/")[1] || "en").toLowerCase();

  const t = (k: string, fb: string) => (dictionaryContact?.[k] ?? fb) as string;
  const ph = (key: string, fallbackLabel: string) => {
    const dictPH =
      dictionaryContact?.[`${key}_placeholder`] ||
      dictionaryContact?.placeholders?.[key];
    if (dictPH) return String(dictPH);
    const label = t(key, fallbackLabel);
    return locale.startsWith("id") ? `Masukkan ${label}` : `Enter ${label}`;
  };

  const eyebrow =
    dictionaryContact?.eyebrow ??
    (locale.startsWith("id") ? "Kirim Kami Pesan" : "Send Us a Message");

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormState>({
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      message: "",
    },
  });

  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  const submitLabel = dictionaryContact?.submit ?? "Send Message";
  const successMessage =
    dictionaryContact?.success ??
    (locale.startsWith("id")
      ? "Pesan Anda sudah kami terima. Kami akan menghubungi Anda segera."
      : "Your message has been sent. We'll get back to you shortly.");
  const errorMessage =
    dictionaryContact?.error ??
    (locale.startsWith("id")
      ? "Kami tidak dapat mengirim pesan. Silakan coba lagi."
      : "We could not send your message. Please try again.");

  const recipient = useMemo(() => CONTACT.email ?? "info@dmdshoeparts.com", []);

  const onSubmit = async (values: FormState) => {
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          whatsapp: values.whatsapp ?? "",
          message: values.message,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          (payload &&
            typeof payload === "object" &&
            "message" in payload &&
            typeof (payload as any).message === "string" &&
            (payload as any).message) ||
          errorMessage;
        throw new Error(message);
      }

      setStatus({ type: "success", message: successMessage });
      reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error && error.message
            ? error.message
            : errorMessage,
      });
    }
  };

  return (
    <section className="bg-gray-50">
      <Container className="mx-auto max-w-[1200px] px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Kiri */}
          <div className={inter.className}>
            <p className="text-[15px] md:text-base lg:text-[17px] font-semibold text-primary tracking-wide">
              — {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#121212] md:text-4xl">
              {dictionaryContact?.description ??
                "Have questions about sizes or want a custom order? Our team is ready to help."}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
              {dictionaryContact?.contact_info_description ??
                "We believe every step starts with the right pair of shoes, so don't hesitate to chat with us directly!"}
            </p>
          </div>

          {/* Kanan: Form */}
          <div className={`${plusJakartaSans.className} rounded-lg bg-white shadow-sm ring-1 ring-black/5`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("full_name", "Full Name")}
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={ph("full_name", "Full Name")}
                  required
                  autoComplete="name"
                  {...register("name", { required: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {errors.name ? (
                  <p className="mt-1 text-xs text-red-600">
                    {locale.startsWith("id") ? "Nama wajib diisi." : "Name is required."}
                  </p>
                ) : null}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("email", "Email Address")}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={ph("email", "Email Address")}
                  autoComplete="email"
                  required
                  {...register("email", { required: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {errors.email ? (
                  <p className="mt-1 text-xs text-red-600">
                    {locale.startsWith("id") ? "Email wajib diisi." : "Email is required."}
                  </p>
                ) : null}
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("whatsapp", "WhatsApp Number (Optional)")}
                </label>
                <Controller
                  name="whatsapp"
                  control={control}
                  rules={{
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      id="whatsapp"
                      placeholder={ph("whatsapp", "WhatsApp Number (Optional)")}
                      defaultCountry="ID"
                      international
                      countryCallingCodeEditable={false}
                      className="contact-phone w-full"
                    />
                  )}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("message", "Message")}
                </label>
                <textarea
                  id="message"
                  placeholder={ph("message", "Message")}
                  rows={5}
                  required
                  {...register("message", { required: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-red-600">
                    {locale.startsWith("id") ? "Pesan wajib diisi." : "Message is required."}
                  </p>
                ) : null}
              </div>

              {status.type === "success" ? (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {status.message}
                </div>
              ) : null}
              {status.type === "error" ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {status.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? locale.startsWith("id")
                    ? "Mengirim..."
                    : "Sending..."
                  : submitLabel}
              </button>

              <p className="text-xs text-gray-500">
                {locale.startsWith("id")
                  ? `Pesan ini akan dikirim ke ${recipient}.`
                  : `This message will be sent to ${recipient}.`}
              </p>
            </form>
          </div>
        </div>
      </Container>

      {/* Style khusus PhoneInput */}
      <style jsx global>{`
        .contact-phone {
          display: flex;
          align-items: center;
          font-family: var(--font-inter), ui-sans-serif, system-ui;
        }
        .contact-phone input {
          flex: 1;
          min-width: 0;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .contact-phone input:focus {
          border-color: #003663;
          box-shadow: 0 0 0 2px rgba(0, 54, 99, 0.3);
        }
        .contact-phone .PhoneInputCountry {
          margin-right: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.625rem;
          background: white;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .contact-phone .PhoneInputCountrySelect {
          outline: none;
          font-family: var(--font-inter), ui-sans-serif, system-ui;
        }
      `}</style>
    </section>
  );
}
