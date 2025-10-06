"use client";

import React from "react";
import ProductItem from "./ProductItem";

type Product = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  promoPrice?: number | null;
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {


  return (
    <div className="container mx-auto ">
      <div className=" grid grid-cols-2 sm:grid-cols-4 space-x-2">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
