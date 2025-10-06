"use client";
import React, { useState } from "react";
import clsx from "clsx";

type ProductChoiceProps = {
  options: string[];
  onChange?: (value: string) => void;
  label:string
};

const ProductChoice: React.FC<ProductChoiceProps> = ({ options, onChange,label }) => {
  const [active, setActive] = useState<string>("");

  const handleClick = (value: string) => {
    setActive(value);
    onChange?.(value);

  };

  return (
    <div className="">
      <h2 className="font-medium">{label}</h2>
      <div className="flex flex-wrap gap-3 mt-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={clsx(
              "px-4 py-2 rounded-[4px] border text-[14px] font-semibold leading-[150%] tracking-[-0.6%] transition-colors",
              active === option
                ? "border-primary bg-primary/10 text-primary"
                : "border-[#EEEEEE] text-[#121212] hover:bg-blue-50"
            )}
          >
            <h3>{option}</h3>
            
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductChoice;
