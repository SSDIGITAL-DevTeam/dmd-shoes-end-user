"use client";

import Container from "@/components/ui-custom/Container";
import React, { useState } from "react";
import Image from "next/image";

function HomeVideo() {
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <div className="w-full">
        {!open ? (
          // Thumbnail sebelum di klik
          <button
            onClick={() => setOpen(true)}
            className="relative w-full focus:outline-none"
          >
            <Image
              src="/assets/demo/demo-product-video.png"
              alt="Demo Banner"
              width={0} // dummy
              height={0} // dummy
              sizes="100vw"
              className="w-full h-auto rounded-lg cursor-pointer"
            />
            {/* Tombol Play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/70 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="black"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.943l11.25 6.847a1.125 1.125 0 010 1.886L6.917 20.29a1.125 1.125 0 01-1.667-.943V5.653z"
                  />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          // Video muncul di tempat yang sama
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/5h6hI7PWdAk?autoplay=1"
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </Container>
  );
}

export default HomeVideo;
