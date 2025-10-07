import { getDictionary } from "../../dictionaries/get-dictionary";
import { i18n, type Locale } from "../../i18n-config";
import AuthInitializer from "@/components/providers/AuthInitializer";
import "./global.css";

export const metadata = {
  title: "i18n within app router - Vercel Examples",
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
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
