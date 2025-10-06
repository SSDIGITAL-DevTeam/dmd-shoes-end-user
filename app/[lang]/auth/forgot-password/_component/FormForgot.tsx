"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMailOpenOutline } from "react-icons/io5";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type FormValues = {
  email: string;
};

function FormLogin() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = (data: FormValues) => {
    setEmail(data.email); // simpan email
    setSubmitted(true);   // ganti tampilan
  };

  if (submitted) {
    return (
      <div className="space-y-[32px] ">
        <IoMailOpenOutline
          size={80}
          className="mx-auto mb-4"
          color="#191C42"
        />
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
          Cek Email Anda
        </h1>
        <p className="text-center text-[20px]">
          Kami telah mengirimkan kode verifikasi ke{" "}
          <b>{email}</b>
        </p>
        <p className='text-center text-[20px] leading-[150%]'>
          Tidak mendapatkan link
          <span>
          <button className="text-[#191C42] font-semibold underline">Klik untuk kirim ulang</button> 
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
            Reset kata sandi
          </h1>
          <p className="text-center font-medium text-[20px]">Masukkan email anda untuk reset kata sandi</p>
          <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-6 font-['Plus_Jakarta_Sans']`}
    >
      <input
        type="email"
        {...register("email", { required: true })}
        className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
        placeholder="Email"
      />

      <button
        type="submit"
        className="w-full bg-primary text-white p-[10px] hover:bg-[#3a00b8] transition"
      >
        Lanjutkan
      </button>
    </form>
    </>

  );
}

export default FormLogin;
