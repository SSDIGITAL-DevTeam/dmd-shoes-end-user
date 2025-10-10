"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Container from "@/components/ui-custom/Container";
import { plusJakartaSans } from "@/config/font";
import { usePathname } from "next/navigation"; // <-- IMPORT INI

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
  display: "swap",
});

type FormState = {
  nama: string;
  email: string;
  whatsapp: string;
  pesan: string;
};

type Props = {
  dictionaryContact: any;
  lang?: string; // opsional
};

export default function ContactForm({ dictionaryContact, lang }: Props) {
  const pathname = usePathname();
  const locale = (lang || pathname?.split("/")[1] || "en").toLowerCase();

  // helper terjemahan & placeholder
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

  const { control } = useForm();
  const [form, setForm] = useState<FormState>({
    nama: "",
    email: "",
    whatsapp: "",
    pesan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", form);
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
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* Full Name */}
              <div>
                <label htmlFor="nama" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("full_name", "Full Name")}
                </label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder={ph("full_name", "Full Name")}
                  autoComplete="name"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("email", "Email Address")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={ph("email", "Email Address")}
                  autoComplete="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("whatsapp", "WhatsApp Number (Optional)")}
                </label>
                <Controller
                  name="whatsapp"
                  control={control}
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
                <label htmlFor="pesan" className="mb-1 block text-sm font-medium text-[#121212]">
                  {t("message", "Message")}
                </label>
                <textarea
                  id="pesan"
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  placeholder={ph("message", "Message")}
                  rows={5}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {dictionaryContact?.submit ?? "Send Message"}
              </button>
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
