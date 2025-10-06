import { getDictionary } from "../../dictionaries/get-dictionary";
import { i18n, type Locale } from "../../i18n-config";
import Footer from "./components/layout/footer/Footer";
import Header from "./components/layout/header/Header"
import "./global.css"; // <- global CSS
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
  const lang = await params.lang;
  const { children } = props;
  const dictionary = await getDictionary(lang);
  return (
    <html lang={params.lang}>
      <body>
      
    
   
        {children}
       
      </body>
    </html>
  );
}
