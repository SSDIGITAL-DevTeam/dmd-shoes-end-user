"use client";

import Container from "@/components/ui-custom/Container";
import ProductPromo from "@/components/demo/product/ProductFeatured";
import HomeHero from "./_components/HomeHero";
import HomeVideo from "./_components/HomeVideo";
import ProductSlider1 from "./_components/ProductSlider1";
import ProductSlider2 from "./_components/ProductSlider2";
import CategorySection from "./_components/CategorySection";
import TechnologySection from "./_components/TechnologySection";
import HomeContact from "./_components/HomeContact";
import Section from "@/components/layout/Section";
import type { HomeBootstrapResponse } from "@/services/bootstrap.service";
import type { Locale } from "@/i18n-config";

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
      {/* HERO – tidak perlu padding ekstra */}
      <Section className="py-0 !pt-0 !pb-0">
        <HomeHero lang={lang} dict={homeDictionary} hero={homepage?.hero} />
      </Section>

      {/* FEATURED PRODUCTS */}
      <Section className="py-2" size="dense" bg="bg-[#F5F5F5]">
        <Container>
          <ProductPromo
            lang={lang}
            products={featuredProducts}
            isLoading={false}
            title={homeDictionary?.featured?.title ?? "Produk Unggulan"}
            viewAllLabel={homeDictionary?.featured?.viewAll ?? "Lihat Semua Produk"}
            viewAllHref={`/${lang}/product`}
          />
        </Container>
      </Section>

      {/* VIDEO */}
      <Section className="py-2 sm:py-3 md:py-4 pb-4">
        <HomeVideo video={homepage?.video} />
      </Section>

      {/* SLIDER 1 */}
      <Section className="py-2 sm:py-3 md:py-4 !pt-0">
        <ProductSlider1
          images={sliderCarousel1.length ? sliderCarousel1 : sliderFallback}
          isLoading={false}
        />
      </Section>

      {/* TECHNOLOGY */}
      <Section>
        <TechnologySection lang={lang} dict={homeDictionary} />
      </Section>

      {/* CATEGORIES */}
      <Section>
        <CategorySection
          lang={lang}
          dict={homeDictionary}
          categories={categories}
          isLoading={false}
        />
      </Section>

      {/* SLIDER 2 */}
      <Section>
        <ProductSlider2
          images={sliderCarousel2.length ? sliderCarousel2 : sliderDefault}
          isLoading={false}
        />
      </Section>

      {/* CONTACT */}
      <Section bg="bg-[#F5F5F5]">
        <HomeContact lang={lang} dict={homeDictionary} />
      </Section>
    </main>
  );
}
