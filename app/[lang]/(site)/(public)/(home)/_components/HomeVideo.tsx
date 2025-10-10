"use client";

import Container from "@/components/ui-custom/Container";
import type { HomepageVideo } from "@/services/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";

type HomeVideoProps = {
  video?: HomepageVideo;
  posterFallback?: string;
};

const FALLBACK_POSTER = "/assets/demo/demo-product-video.png";
const FALLBACK_YOUTUBE = "https://www.youtube.com/embed/5h6hI7PWdAk";

const toEmbedUrl = (url?: string | null) => {
  if (!url) return FALLBACK_YOUTUBE;
  if (url.includes("youtube.com") && url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
};

export default function HomeVideo({
  video,
  posterFallback = FALLBACK_POSTER,
}: HomeVideoProps) {
  const [open, setOpen] = useState(false);

  const videoSrc = useMemo(() => {
    if (!video) return FALLBACK_YOUTUBE;
    if (video.mode === "youtube") {
      return toEmbedUrl(video.url ?? FALLBACK_YOUTUBE);
    }
    if (video.file_url) {
      return video.file_url;
    }
    return FALLBACK_YOUTUBE;
  }, [video]);

  const poster = video?.cover_url ?? posterFallback;

  return (
    <section className="py-12">
      <Container>
        <div className="w-full">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="relative w-full focus:outline-none"
          >
            <Image
              src={poster}
              alt="Product video preview"
              width={1280}
              height={720}
              sizes="100vw"
              className="h-auto w-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-white/70 p-3 md:p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="h-8 w-8 text-black md:h-10 md:w-10"
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
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full rounded-lg"
              src={videoSrc}
              title="Homepage video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}
        </div>
      </Container>
    </section>
  );
}
