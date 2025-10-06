"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoMailOpenOutline } from "react-icons/io5";
import { BiChevronLeft } from "react-icons/bi";
type FormValues = {
  password: string;
  newEmail: string;
};

function ProfileFormEmail() {
  const [openModal, setOpenModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    console.log("Submit data:", data);

    setSubmittedEmail(data.newEmail);

    // simulasi API call
    setTimeout(() => {
      setOpenModal(false);
      setSuccessModal(true);
    }, 800);
  };

  return (
    <>
      {/* Tombol */}
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className={`flex items-center justify-center gap-2 
          border border-primary text-primary px-4 py-2 
          rounded hover:bg-primary hover:text-white transition 
          w-full lg:w-auto`}
      >
        <FaEnvelope /> Ubah Alamat Email
      </button>

      {/* Modal Form */}
      {openModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setOpenModal(false)} // klik background = tutup modal
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()} // cegah close saat klik isi modal
          >
            <h2 className="text-center text-xl font-semibold mb-4 text-primary">
              Ubah alamat email
            </h2>

            <div className="space-y-4">
              {/* Input Password */}
              <label className="block text-sm mb-1 text-[16px] leading-[150%]">Masukkan Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password wajib diisi" })}
                  className="w-full border rounded px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}

              {/* Input Email */}
              <label className="block text-sm mb-1 text-[16px] leading-[150%]">Masukkan Alamat Email Baru</label>
              <input
                type="email"
                {...register("newEmail", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Format email tidak valid",
                  },
                })}
                className="w-full border rounded px-3 py-2"
              />
              {errors.newEmail && (
                <p className="text-red-500 text-sm">{errors.newEmail.message}</p>
              )}

              {/* Tombol Aksi */}
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
              >
                Ubah alamat email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Success */}
      {successModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setSuccessModal(false)} // klik background = tutup modal sukses
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSuccessModal(false)}
              className="absolute top-4 left-4 text-sm text-gray-500 flex items-center gap-1 hover:underline"
            >
              <BiChevronLeft/> Back
            </button>

            <IoMailOpenOutline  className="text-primary text-5xl mx-auto mb-4" />

            <h2 className="text-xl font-semibold mb-2 text-primary">
              Periksa Email Baru Anda!
            </h2>
            <p className="text-gray-700 mb-2">
              Kami telah mengirimkan tautan verifikasi ke{" "}
              <span className="font-semibold">{submittedEmail}</span>. <br />
              Klik tautan tersebut dalam 30 menit ke depan untuk mengonfirmasi
              perubahan email Anda.
            </p>
            <p className="text-gray-600 text-sm">
              Tidak menerima email? Periksa folder spam Anda atau{" "}
              <button className="text-primary font-medium hover:underline">
                kirim ulang tautannya.
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileFormEmail;
