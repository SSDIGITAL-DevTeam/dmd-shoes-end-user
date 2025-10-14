"use client";

import Container from "@/components/ui-custom/Container";
import type { HomepageVideo } from "@/services/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import clsx from "clsx";

type HomeVideoProps = {
  video?: HomepageVideo;
  posterFallback?: string;
  className?: string; // kontrol spacing dari parent
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
  className,
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
    // tidak ada py default; biarkan parent yang atur via className
    <section className={clsx(className)}>
      <Container>
        <div className="w-full">
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="relative block w-full focus:outline-none"
              aria-label="Play video"
            >
              {/* poster dengan rasio video agar tidak loncat layout */}
              <div className="relative w-full overflow-hidden bg-black/5 aspect-video">
                <Image
                  src={poster}
                  alt="Product video preview"
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </button>
          ) : (
            <div className="aspect-video w-full overflow-hidden">
              <iframe
                className="h-full w-full"
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
