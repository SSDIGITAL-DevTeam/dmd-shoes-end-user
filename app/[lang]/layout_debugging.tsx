// app/[lang]/layout.tsx
import type { ReactNode } from "react";
import { getDictionary } from "../../dictionaries/get-dictionary";
import { i18n, type Locale } from "../../i18n-config";
import AuthInitializer from "@/components/providers/AuthInitializer";
import { ReactQueryProvider } from "../../components/providers/ReactQueryProvider";
import {
    inter,
    assistant,
    lato,
    poppins,
    plusJakartaSans,
} from "./config/font";
import "./global.css";

export const metadata = {
    title: "DMD Shoes",
    description: "DMD Shoes",
};

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

/** ===== DEBUG FLAGS (root) =====
 * Toggle ini untuk menguji bagian provider-level.
 * Mulai dari semuanya FALSE, lalu hidupkan satu per satu.
 */
const USE_DICTIONARY = false;     // test SSR fetch dictionary di root
const USE_PROVIDERS = false;     // ReactQueryProvider + AuthInitializer

type RootLayoutProps = {
    children: ReactNode;
    params: Promise<{ lang: Locale }>; // Next 15: params adalah Promise
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
    console.log("[root] enter");
    const { lang } = await params;
    console.log("[root] params.lang =", lang);

    if (USE_DICTIONARY) {
        console.time("[root] getDictionary");
        try {
            await getDictionary(lang);
            console.timeEnd("[root] getDictionary");
        } catch (e) {
            console.error("[root] getDictionary error:", e);
        }
    }

    const bodyClass = `${inter.className} ${assistant.variable} ${lato.variable} ${poppins.variable} ${plusJakartaSans.variable} antialiased`;

    // MODE MINIMAL: jangan render apa-apa selain {children} dulu
    if (!USE_PROVIDERS) {
        console.log("[root] providers OFF → render minimal");
        return (
            <html lang={lang}>
                <body className={bodyClass}>
                    {/* SENGAJA: tanpa provider */}
                    {children}
                </body>
            </html>
        );
    }

    console.log("[root] providers ON");
    return (
        <html lang={lang}>
            <body className={bodyClass}>
                <ReactQueryProvider>
                    <AuthInitializer />
                    {children}
                </ReactQueryProvider>
            </body>
        </html>
    );
}
