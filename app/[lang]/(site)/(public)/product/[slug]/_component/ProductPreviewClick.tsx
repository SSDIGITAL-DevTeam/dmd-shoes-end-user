"use client";
import Image from "next/image";

type ProductPreview = {
  id: string;
  src: string;
  alt?: string;
  value?: string;
  price?: number;
  description?: string;
};

type Props = {
  productPreviews: ProductPreview[];
  productPreviewSelection: ProductPreview | null;
  setProductPreviewSelection: (p: ProductPreview | null) => void;
};

export default function ProductDetail({
  productPreviews,
  productPreviewSelection,
  setProductPreviewSelection,
}: Props) {
  return (
    <div>
      <div className="flex gap-4 mb-8">
        {productPreviews.map((variation) => (
          <button
            key={variation.id}
            onClick={() => setProductPreviewSelection(variation)}
            className={`cursor-pointer flex flex-col items-center justify-center rounded-lg transition overflow-hidden ${productPreviewSelection?.id === variation.id
                ? "border-2 border-primary"
                : "border border-transparent hover:border-primary"
              }`}
          >
            <Image
              src={variation.src}
              alt={variation.alt ?? "product preview"}
              width={100}
              height={100}
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
