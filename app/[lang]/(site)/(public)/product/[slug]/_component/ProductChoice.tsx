"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

type ProductChoiceProps = {
  options: string[];
  label: string;
  value?: string | null;
  onSelect?: (value: string) => void;
};

const ProductChoice: React.FC<ProductChoiceProps> = ({
  options,
  label,
  value,
  onSelect,
}) => {
  const [internalValue, setInternalValue] = useState<string>("");
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value ?? "" : internalValue;

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value ?? "");
    }
  }, [isControlled, value]);

  const handleClick = (selected: string) => {
    if (!isControlled) {
      setInternalValue(selected);
    }
    onSelect?.(selected);
  };

  return (
    <div>
      <h2 className="font-medium">{label}</h2>
      <div className="mt-2 flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleClick(option)}
            className={clsx(
              "rounded-[4px] border px-4 py-2 text-[14px] font-semibold leading-[150%] tracking-[-0.6%] transition-colors",
              activeValue === option
                ? "border-primary bg-primary/10 text-primary"
                : "border-[#EEEEEE] text-[#121212] hover:bg-blue-50",
            )}
          >
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductChoice;
