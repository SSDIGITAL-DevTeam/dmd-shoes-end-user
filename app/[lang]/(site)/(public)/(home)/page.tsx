import { getDictionary } from "../../../../../dictionaries/get-dictionary";
import { getDictionaryAbout as getDictionaryHome } from "../../../../../dictionaries/home/get-dictionary-home";
import { Locale } from "../../../../../i18n-config";
import ProductPromo from "@/components/demo/product/ProductPromo";
import ProductSliderthree from "./_components/ProductSliderDemoThreeImages";
import ProductSlider1 from "./_components/ProductSlider1";
import ProductSlider2 from "./_components/ProductSlider2"; 
import ProductNew from "@/components/demo/product/ProductNew";
import { Inter, Assistant } from "next/font/google";

import Container from "@/components/ui-custom/Container";
import TechnologySection from "./_components/TechnologySection";
import CategorySection from "./_components/CategorySection";
import HomeContact from "./_components/HomeContact";
import HomeHero from "./_components/HomeHero";
import HomeVideo from "./_components/HomeVideo";
const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});
export default async function IndexPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  const homeDictionary = await getDictionaryHome(lang);

  return (
    <>

    {/* hero section */}
      <HomeHero lang={lang} dict={homeDictionary}></HomeHero>
      
      <div className="bg-[#F5F5F5] py-[80px]">
        <ProductPromo  lang={lang}/>
      </div>
     
      <HomeVideo></HomeVideo>

     
      <ProductSlider1></ProductSlider1>
      <TechnologySection lang={lang} dict={homeDictionary}></TechnologySection>
      <CategorySection lang={lang} dict={homeDictionary}></CategorySection>

      <ProductSlider2></ProductSlider2>
      <HomeContact lang={lang} dict={homeDictionary}></HomeContact>

     
      {/* product video */}
    </>
  );
}

export const metadata = {
  title: "About Our Company",
  description: "Learn more about our company",
  
};
