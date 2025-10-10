/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003663",     // warna utama DMD Shoes
        secondary: "#1E40AF",   // opsional: varian biru
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"], // opsional
      },
    },
  },
  plugins: [],
};