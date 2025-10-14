/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "48rem",      // 768px
      lg: "64rem",      // 1024px
      xl: "80rem",      // 1280px
      "2xl": "90rem",   // 1440px
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
      },
      screens: { "2xl": "1440px" },
    },
    extend: {
      // ← nama rasio biar gampang dipakai di komponen
      aspectRatio: {
        // hero / banner
        "hero-mobile": "4 / 5",
        "hero-tablet": "16 / 9",
        "hero-desktop": "21 / 9",
        // produk / katalog
        product: "1 / 1",
        "product-portrait": "4 / 5",
        // konten umum
        "wide": "3 / 1",
        "cinema": "21 / 9",
      },
      colors: {
        primary: "#003663",
        secondary: "#1E40AF",
        "primary-contrast": "#F4F8FB",
        "neutral-900": "#0F172A",
        "neutral-700": "#475569",
        "neutral-500": "#94A3B8",
        "neutral-200": "#E2E8F0",
        "neutral-100": "#F1F5F9",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.35" }],
        "3xl": ["1.75rem", { lineHeight: "1.3" }],
        "4xl": ["2rem", { lineHeight: "1.2" }],
      },
      boxShadow: {
        subtle: "0 1rem 2.5rem rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
      },
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
  ],
};