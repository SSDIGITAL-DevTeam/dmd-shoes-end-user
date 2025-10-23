import Link from "next/link";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n-config";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

type PageParams = {
  params: Promise<{ lang: Locale; id: string; hash: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type VerificationResponse = {
  code?: string;
  message?: string;
};

const buildQueryString = (input: Record<string, string | string[] | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined) search.append(key, entry);
      });
      return;
    }
    search.set(key, value);
  });
  const result = search.toString();
  return result ? `?${result}` : "";
};

const fallbackMessage =
  "Link verifikasi tidak valid atau sudah kedaluwarsa. Silakan minta email verifikasi baru.";

export default async function VerifyEmailPage(props: PageParams) {
  const [{ lang, id, hash }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  if (!API_BASE) {
    return renderError(lang, "Konfigurasi API tidak tersedia. Hubungi administrator.");
  }

  const query = buildQueryString(searchParams);
  const target = `${API_BASE}/email/verify/${encodeURIComponent(id)}/${encodeURIComponent(hash)}${query}`;

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as VerificationResponse | null;
    const code = payload?.code ?? "";
    const message = payload?.message ?? fallbackMessage;

    if (response.ok && code === "email_verified") {
      redirect(`/${lang}?emailVerified=1`);
    }

    if (response.ok && code === "email_already_verified") {
      redirect(`/${lang}?emailVerified=already`);
    }

    return renderError(lang, message);
  } catch (error) {
    console.error("Email verification failed:", error);
    return renderError(
      lang,
      "Terjadi kesalahan saat memverifikasi email. Silakan coba lagi nanti.",
    );
  }
}

const renderError = (lang: Locale, message: string) => (
  <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12 text-center text-gray-700">
    <h1 className="text-3xl font-semibold text-[#003663]">Verifikasi Email</h1>
    <p className="mt-4 max-w-xl text-base">{message}</p>
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
      <Link
        href={`/${lang}/auth/login`}
        className="rounded-md bg-[#003663] px-6 py-2 text-white transition hover:bg-[#04264b]"
      >
        Kembali ke halaman login
      </Link>
      <Link
        href={`/${lang}/auth/register`}
        className="rounded-md border border-[#003663] px-6 py-2 text-[#003663] transition hover:bg-[#003663]/5"
      >
        Daftar akun baru
      </Link>
    </div>
  </main>
);
