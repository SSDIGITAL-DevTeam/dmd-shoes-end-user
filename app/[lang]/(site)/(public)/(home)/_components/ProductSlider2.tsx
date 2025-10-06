import ProductSliderListOne from "@/components/partials/product-slider/ProductSliderListOne";

export default function Page() {
  const images = [
    { src: "/assets/demo/product-slider-2-images.webp", alt: "Product 1", name: "Product 1" },
    { src: "/assets/demo/product-slider-2-images.webp", alt: "Product 1", name: "Product 1" },

  
  ];

  return (
    <div className="p-8">
      <ProductSliderListOne images={images} autoPlayInterval={4000} />
    </div>
  );
}