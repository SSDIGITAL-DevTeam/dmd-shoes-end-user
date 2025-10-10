"use client";

import ProductPromo from "@/components/demo/product/ProductFeatured";
import HomeHero from "./_components/HomeHero";
import HomeVideo from "./_components/HomeVideo";
import ProductSlider1 from "./_components/ProductSlider1";
import ProductSlider2 from "./_components/ProductSlider2";
import CategorySection from "./_components/CategorySection";
import TechnologySection from "./_components/TechnologySection";
import HomeContact from "./_components/HomeContact";
import type { HomeBootstrapResponse } from "@/services/bootstrap.service";
import type { Locale } from "@/i18n-config";

const FALLBACK_BOOTSTRAP: HomeBootstrapResponse = {
  homepage: {
    id: 0,
    hero: undefined,
    video: undefined,
    sliders: {},
  },
  categories: [],
  featured_products: [],
};

type HomePageClientProps = {
  lang: Locale;
  homeDictionary: any;
  initialBootstrap?: HomeBootstrapResponse;
};

export default function HomePageClient({
  lang,
  homeDictionary,
  initialBootstrap,
}: HomePageClientProps) {
  const bootstrap = initialBootstrap ?? FALLBACK_BOOTSTRAP;

  const homepage = bootstrap.homepage;
  const sliders = homepage?.sliders ?? {};
  const sliderCarousel1 = sliders.carousel1 ?? sliders.default ?? [];
  const sliderCarousel2 = sliders.carousel2 ?? [];
  const sliderDefault = sliders.default ?? [];
  const sliderFallback = sliderCarousel1.length ? sliderCarousel1 : sliderDefault;

  const featuredProducts = bootstrap.featured_products ?? [];
  const categories = bootstrap.categories ?? [];

  return (
    <>
      <HomeHero lang={lang} dict={homeDictionary} hero={homepage?.hero} />

      <div className="bg-[#F5F5F5] py-12">
        <ProductPromo
          lang={lang}
          products={featuredProducts}
          isLoading={false}
          title={homeDictionary?.featured?.title ?? "Produk Unggulan"}
          viewAllLabel={
            homeDictionary?.featured?.viewAll ?? "Lihat semua produk"
          }
          viewAllHref={`/${lang}/product`}
        />
      </div>

      <HomeVideo video={homepage?.video} />

      <ProductSlider1
        images={sliderCarousel1.length ? sliderCarousel1 : sliderFallback}
        isLoading={false}
      />

      <TechnologySection lang={lang} dict={homeDictionary} />

      <CategorySection
        lang={lang}
        dict={homeDictionary}
        categories={categories}
        isLoading={false}
      />

      <ProductSlider2
        images={sliderCarousel2.length ? sliderCarousel2 : sliderDefault}
        isLoading={false}
      />

      <HomeContact lang={lang} dict={homeDictionary} />
    </>
  );
}
