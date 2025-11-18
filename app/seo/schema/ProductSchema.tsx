"use client";

interface ProductSchemaProps {
  name: string;
  description: string;
  images: string[];
  sku?: string;
  brand?: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url: string;
}

export default function ProductSchema({
  name,
  description,
  images,
  sku,
  brand = "DMD Shoe Parts",
  price,
  currency = "IDR",
  availability = "InStock",
  url
}: ProductSchemaProps) {
  const data = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description,
    image: images,
    sku,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: price.toString(),
      availability: `https://schema.org/${availability}`,
      url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
