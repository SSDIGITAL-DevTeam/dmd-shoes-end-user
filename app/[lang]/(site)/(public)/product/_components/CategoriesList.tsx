import { lato } from "@/config/font";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type Category = {
  name: string;
  items: string[];
};

type Props = {
  categories: Category[];
  dict?: any;
};

const CollapsibleCategories: React.FC<Props> = ({ categories, dict }) => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (name: string) => {
    setOpenCategories((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  return (
    <div className={`${lato.className} space-y-[16px]` }>
   
            
      <div className="text-[14px]">{dict?.allProducts || "Semua Produk (120)"}</div>

      {categories.map((cat) => {
        const isOpen = openCategories.includes(cat.name);
        return (
          <div key={cat.name} className="space-y-[16px]">
            <button
              onClick={() => toggleCategory(cat.name)}
              className="flex items-center justify-between w-full font-medium text-gray-700"
            >
              <h2>{cat.name}</h2>
              <span className="text-gray-500">
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>

            {isOpen && (
              <ul className="pl-[12px] pb-[8px] pt-2 space-y-1 border-b border-b-[#CCCCCC]">
                {cat.items.map((item) => (
                  <li key={item}>
                    <label className="inline-flex items-center text-sm text-gray-600">
                      <input type="checkbox" className="mr-2" />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CollapsibleCategories;
