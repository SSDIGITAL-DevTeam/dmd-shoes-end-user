"use client";

import ProductSortDesktop from "./ProductSortDesktop";
import ProductSortMobile from "./ProductSortMobile";

type SortOption = {
  label: string;
  value: string;
};

type ProductSortProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
};

export default function ProductSort({
  value,
  options,
  onChange,
}: ProductSortProps) {
  return (
    <>
      <ProductSortDesktop value={value} options={options} onChange={onChange} />
      <ProductSortMobile value={value} options={options} onChange={onChange} />
    </>
  );
}
