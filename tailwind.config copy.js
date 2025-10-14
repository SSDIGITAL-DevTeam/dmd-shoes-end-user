/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "90rem",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
      },
    },
    extend: {
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
  plugins: [],
};
