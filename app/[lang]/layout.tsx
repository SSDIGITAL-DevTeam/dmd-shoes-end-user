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
  title: "DMD ShoeParts Manufacturing",
  description: "How to do i18n in Next.js 15 within app router",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const { children } = props;
  await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <body
        className={`${inter.className} ${assistant.variable} ${lato.variable} ${poppins.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthInitializer />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
