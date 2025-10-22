"use client"
import React, { useState, useRef } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function FormLogin() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Fokus ke input berikutnya jika ada
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 4).split("");
    const newOtp = [...otp];
    pasted.forEach((char, i) => {
      if (/^\d$/.test(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    // Fokus ke input terakhir yang terisi
    const lastIndex = pasted.length - 1;
    if (lastIndex >= 0 && lastIndex < otp.length) {
      inputsRef.current[lastIndex]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <form className={`space-y-6 ${jakartaSans.className}`}>
        {/* OTP Input */}
        <div className="flex justify-between gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {inputsRef.current[index] = el;}}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[60px] h-[60px] text-center text-[24px] font-semibold border-b-2 border-[#1212124D] focus:border-blue-500 outline-none"
            />
          ))}
        </div>

        {/* Button Login */}
        <button
          type="submit"
          className="w-full bg-primary text-white p-[10px] hover:bg-[#3a00b8] transition"
        >
          Verifikasi
        </button>

        <p className='text-center text-[20px] leading-[150%]'>
          Tidak mendapatkan kode?
          <button className="text-[#191C42] font-semibold underline">Daftar</button>
        </p>
      </form>
    </>
  );
}

export default FormLogin;
