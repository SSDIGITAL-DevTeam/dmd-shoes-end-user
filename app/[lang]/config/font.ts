// lib/fonts.ts
import { Inter, Lato, Poppins, Assistant ,Plus_Jakarta_Sans } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // sesuaikan kebutuhan
  variable: "--font-lato",
})

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // bisa tambah 200, 300, dst sesuai kebutuhan
  variable: "--font-assistant",
})
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // tambahkan sesuai kebutuhan
  variable: "--font-plus-jakarta",
})