import React from 'react'
import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google';
import InputPassword from '@/components/ui-custom/form/InputPassword';
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // sesuaikan kebutuhan
});
function FormLogin() {
 
  return (
    <form className="space-y-6 font-['Plus_Jakarta_Sans']">
      
 

      <input
        type="email"
        className={`w-full text-[#121212]/75 text-[20px] font-medium border-b border-[#1212124D] px-[10px] py-[10px] focus:outline-none focus:border-blue-500 placeholder-gray-400 ${jakartaSans.className}`}
        placeholder="Email"
      />

      <InputPassword></InputPassword>


      {/* Forgot Password */}
      <div className="text-right">
        <Link
          href="/auth/forgot-password"
          className={`text-primary text-[20px] underline  ${jakartaSans.className}`}
        >
          Lupa kata sandi?
        </Link>
      </div>

      {/* Button Login */}
      <button
        type="submit"
        className="w-full bg-primary text-white p-[10px]  hover:bg-[#3a00b8] transition"
      >
        Login
      </button>
      <p className='text-center text-[20px] leading-[150%]'>
        Belum punya akun? <Link className="text-[#191C42] font-semibold underline" href="/auth/register">Daftar</Link> 
      </p>
    </form>
  )
}

export default FormLogin
