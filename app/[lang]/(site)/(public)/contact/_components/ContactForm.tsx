// components/ContactForm.tsx
"use client";
import Image from "next/image";
import Container from "@/components/ui-custom/Container";
import { useState } from "react";
import { Inter } from "next/font/google";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Controller, useForm } from "react-hook-form";
import { plusJakartaSans } from "@/config/font";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // buat variable agar bisa dipakai di Tailwind
  display: "swap",
});

export default function ContactForm({ dictionaryContact }: { dictionaryContact: any }) {
  const { control } = useForm();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    pesan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", form);
    // Di sini bisa tambahkan logic untuk kirim ke API / email service
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-10 bg-gray-50 p-8 ">
        {/* Bagian Kiri */}
        <Container className="flex flex-col lg:flex-row space-x-[40px] items-center space-y-8">
          <div className={`w-full lg:w-1/2 space-y-6 ${inter.className}`}>
            <h3 className="text-primary font-semibold text-[32px] text-bold mb-2">
              - Kirim Kami Pesan 📩
            </h3>
            <h2 className="mt-[32px] text-2xl font-semibold leading-[150%] lg:text-[44px] font-bold mb-4">
              {dictionaryContact?.description}
            </h2>
            <p className="mt-[16px] text-gray-700 text-[20px] leading-[150%]">
              {dictionaryContact?.contact_info_description}
            </p>
          </div>

          {/* Bagian Kanan (Form) */}
          <div className={` ${plusJakartaSans.className} w-full lg:w-1/2 bg-white rounded-lg   `}>
            <form onSubmit={handleSubmit} className="w-full space-y-4 p-6">
              {/* Nama */}
              <div className="space-y-2">
                <label className="block text-[#121212] mb-1">{dictionaryContact?.full_name}</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder={dictionaryContact?.full_name}
                  className={`w-full border rounded-md p-2 border-[#121212]/30 ${inter.className}`}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[#121212] mb-1">{dictionaryContact?.email}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={dictionaryContact?.email}
                  className={`w-full border border-[#121212]/30 rounded-md p-2 ${inter.className}`}
                  required
                />
              </div>

              {/* WhatsApp pakai PhoneInput */}
              <div className="space-y-2">
                <label className="block text-[#121212] mb-1">
                  {dictionaryContact?.whatsapp}
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      placeholder={dictionaryContact?.whatsapp}
                      defaultCountry="ID"
                      international
                      countryCallingCodeEditable={false}
                      className={`profile-phone w-full ${inter.className}`}
                    />
                  )}
                />
              </div>

              {/* Pesan */}
              <div className="space-y-2">
                <label className="block text-[#121212] mb-1">{dictionaryContact?.message}</label>
                <textarea
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  placeholder={dictionaryContact?.message}
                  className={`w-full border border-[#121212]/30 rounded-md p-2 h-28 ${inter.className}`}
                  required
                />
              </div>

              {/* Tombol */}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition bg-primary"
              >
                {dictionaryContact?.submit}
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Style khusus PhoneInput hanya di form ini */}
      <style jsx global>{`
        .profile-phone {
          display: flex;
          align-items: center;
          width: 100%;
          font-family: var(--font-inter), sans-serif; /* konsisten */
        }
        .profile-phone input {
          flex: 1;
          min-width: 0;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.5rem; /* rounded */
          padding: 0.75rem; /* p-3 */
          outline: none;
          transition: 0.2s;
          font-size: 1rem;
          font-family: var(--font-inter), sans-serif; /* konsisten */
        }
        .profile-phone input:focus {
          border-color: #2563eb; /* primary */
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4); /* focus:ring-2 */
        }
        .profile-phone .PhoneInputCountry {
          margin-right: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem;
          background: white;
          display: flex;
          align-items: center;
          flex-shrink: 0; /* flag tidak mengecil */
        }
        .profile-phone .PhoneInputCountrySelect {
          outline: none;
          font-family: var(--font-inter), sans-serif;
        }
      `}</style>
    </>
  );
}
