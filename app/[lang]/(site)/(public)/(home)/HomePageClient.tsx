import ProductPromo from "@/components/demo/product/ProductFeatured";
import Section from "@/components/layout/Section";
import type { HomeBootstrapResponse } from "@/services/bootstrap.service";
import type { Locale } from "@/i18n-config";
import dynamic from "next/dynamic";
import HomeHero from "./_components/HomeHero";
import HomeVideo from "./_components/HomeVideo";
import CategorySection from "./_components/CategorySection";
import TechnologySection from "./_components/TechnologySection";
import HomeContact from "./_components/HomeContact";

const FALLBACK_BOOTSTRAP: HomeBootstrapResponse = {
  homepage: { id: 0, hero: undefined, video: undefined, sliders: {} },
  categories: [],
  featured_products: [],
};

type HomePageClientProps = {
  lang: Locale;
  homeDictionary: any;
  initialBootstrap?: HomeBootstrapResponse;
};

const containerClass = "mx-auto w-full max-w-[1200px] px-4 md:px-6";

const SliderFallback = () => (
  <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
    <div className="aspect-[16/10] w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 md:aspect-[1990/768]" />
  </div>
);

const ProductSlider1 = dynamic(() => import("./_components/ProductSlider1"), {
  loading: () => <SliderFallback />,
});

const ProductSlider2 = dynamic(() => import("./_components/ProductSlider2"), {
  loading: () => <SliderFallback />,
});

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
    <main>
      <Section className="py-0 !pt-0 !pb-0">
        <HomeHero lang={lang} dict={homeDictionary} hero={homepage?.hero} />
      </Section>

      <Section className="py-2" size="dense" bg="bg-[#F5F5F5]">
        <div className={containerClass}>
          <ProductPromo
            lang={lang}
            products={featuredProducts}
            isLoading={false}
            title={homeDictionary?.featured?.title ?? "Produk Unggulan"}
            viewAllLabel={homeDictionary?.featured?.viewAll ?? "Lihat Semua Produk"}
            viewAllHref={`/${lang}/product`}
          />
        </div>
      </Section>

      <Section className="py-2 sm:py-3 md:py-4 pb-4">
        <HomeVideo video={homepage?.video} />
      </Section>

      <Section className="py-2 sm:py-3 md:py-4 !pt-0">
        <ProductSlider1
          images={sliderCarousel1.length ? sliderCarousel1 : sliderFallback}
          isLoading={false}
        />
      </Section>

      <Section>
        <TechnologySection lang={lang} dict={homeDictionary} />
      </Section>

      <Section>
        <CategorySection lang={lang} categories={categories} isLoading={false} />
      </Section>

      <Section>
        <ProductSlider2
          images={sliderCarousel2.length ? sliderCarousel2 : sliderDefault}
          isLoading={false}
        />
      </Section>

      <Section bg="bg-[#F5F5F5]">
        <HomeContact lang={lang} dict={homeDictionary} />
      </Section>
    </main>
  );
}
