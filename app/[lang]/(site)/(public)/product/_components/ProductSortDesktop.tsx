import React from 'react'

function ProductSortDesktop() {
  return (
    <div className='hidden lg:flex'>
         <span className=" text-primary text-[24px] leading-[130%]">
                Urutkan :
            </span>
              
            
              {/* <div className="hidden relative inline-block lg:flex"> */}
              <div className=" flex relative ">
                <select className="bg-white border  border-[#E0E0E0] px-3 py-2 pr-8 text-sm appearance-none">
                  <option>Produk Terpopuler</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                </select>
                {/* Chevron */}
                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
    </div>
  )
}

export default ProductSortDesktop