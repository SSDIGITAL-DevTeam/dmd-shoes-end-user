export const authLoginDict = {
  id: {
    title: "Masuk",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Kata sandi",
    forgot: "Lupa kata sandi?",
    submit: "Login",
    processing: "Memproses...",
    needAccount: "Belum punya akun?",
    register: "Daftar",
    clientErrors: {
      emailRequired: "Email wajib diisi.",
      emailInvalid: "Email tidak valid.",
      passwordRequired: "Kata sandi wajib diisi.",
      envMissing: "NEXT_PUBLIC_API_URL belum diset pada .env.local.",
      checkInputs: "Periksa kembali email dan kata sandi.",
      genericFail: "Terjadi kesalahan. Silakan coba lagi nanti.",
    },
    successDefault: "Login berhasil.",
  },
  en: {
    title: "Sign in",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    forgot: "Forgot password?",
    submit: "Login",
    processing: "Processing...",
    needAccount: "Don’t have an account?",
    register: "Register",
    clientErrors: {
      emailRequired: "Email is required.",
      emailInvalid: "Email is not valid.",
      passwordRequired: "Password is required.",
      envMissing: "NEXT_PUBLIC_API_URL is not set in .env.local.",
      checkInputs: "Please check your email and password.",
      genericFail: "Something went wrong. Please try again later.",
    },
    successDefault: "Login successful.",
  },
} as const;

export type AuthLoginLang = keyof typeof authLoginDict;
