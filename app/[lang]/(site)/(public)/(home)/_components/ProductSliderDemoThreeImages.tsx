import ProductSliderList from "@/components/partials/product-slider/ProductSliderListThree";

export default function Page() {
  const images = [
    { src: "/assets/demo/product-slider-1.png", alt: "Product 1", name: "Product 1" },
    { src: "/assets/demo/product-slider-2.png", alt: "Product 2", name: "Product 2" },
    { src: "/assets/demo/product-slider-1.png", alt: "Product 3", name: "Product 3" },
    { src: "/assets/demo/product-slider-2.png", alt: "Product 4", name: "Product 4" },
    { src: "/assets/demo/product-slider-1.png", alt: "Product 5", name: "Product 5" },
  ];

  return (
    <div className="p-8">
      <ProductSliderList images={images} autoPlayInterval={4000} />
    </div>
  );
}