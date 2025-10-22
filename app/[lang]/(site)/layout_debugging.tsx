// app/[lang]/(site)/layout.tsx
import type { ReactNode } from "react";
import { getDictionary } from "../../../dictionaries/get-dictionary";
import { type Locale } from "../../../i18n-config";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { CONTACT } from "@/config/contact";

/** ===== DEBUG FLAGS (UI) =====
 * Ini inti “hide satu-satu”. Start semua FALSE → on-kan satu-satu:
 * 1) SHOW_CHILDREN → pastikan page basic bisa render.
 * 2) FETCH_DICTIONARY → cek fetch dictionary-nya aman.
 * 3) SHOW_HEADER → cek header (sering ada use client / router logic).
 * 4) SHOW_FOOTER
 * 5) SHOW_FLOATING
 */
const FETCH_DICTIONARY = true;
const SHOW_CHILDREN = true;   // biasanya nyalakan dulu ini
const SHOW_HEADER = false;
const SHOW_FOOTER = true;
const SHOW_FLOATING = true;

type SiteLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  console.log("[site] enter");
  const { lang } = await params;
  console.log("[site] params.lang =", lang);

  let dictionary: any = null;
  if (FETCH_DICTIONARY) {
    console.time("[site] getDictionary");
    try {
      dictionary = await getDictionary(lang);
      console.timeEnd("[site] getDictionary");
    } catch (e) {
      console.error("[site] getDictionary error:", e);
    }
  }

  return (
    <>
      {SHOW_HEADER ? (
        (() => {
          console.log("[site] render Header");
          return <Header lang={lang} dictionary={dictionary} />;
        })()
      ) : (
        <div style={{ display: "none" }} data-debug="header-off" />
      )}

      {SHOW_CHILDREN ? (
        (() => {
          console.log("[site] render children");
          return children;
        })()
      ) : (
        <div data-debug="children-off" />
      )}

      {SHOW_FOOTER ? (
        (() => {
          console.log("[site] render Footer");
          return <Footer lang={lang} dictionary={dictionary} />;
        })()
      ) : (
        <div style={{ display: "none" }} data-debug="footer-off" />
      )}

      {SHOW_FLOATING ? (
        (() => {
          console.log("[site] render FloatingContact");
          return <FloatingContact phone={CONTACT.whatsapp} />;
        })()
      ) : (
        <div style={{ display: "none" }} data-debug="floating-off" />
      )}
    </>
  );
}
