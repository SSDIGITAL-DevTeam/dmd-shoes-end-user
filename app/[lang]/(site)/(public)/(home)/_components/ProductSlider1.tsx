import ProductSliderListOne from "@/components/partials/product-slider/ProductSliderListOne";

export default function Page() {
  const images = [
    { src: "/assets/demo/product-slider-3-images.webp", alt: "Product 1", name: "Product 1" },
    { src: "/assets/demo/product-slider-3-images.webp", alt: "Product 2", name: "Product 2" },

    { src: "/assets/demo/product-slider-3-images.webp", alt: "Product 4", name: "Product 4" },
    { src: "/assets/demo/product-slider-3-images.webp", alt: "Product 5", name: "Product 5" },
  ];

  return (
    <div className="p-8">
      <ProductSliderListOne images={images} autoPlayInterval={4000} />
    </div>
  );
}