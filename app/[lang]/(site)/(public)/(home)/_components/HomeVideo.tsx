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

const FALLBACK_YOUTUBE = "https://www.youtube.com/embed/5h6hI7PWdAk";

const toEmbedUrl = (url?: string | null) => {
  if (!url) return FALLBACK_YOUTUBE;
  if (url.includes("youtube.com") && url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
};

export default function HomeVideo({ video, className }: HomeVideoProps) {
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

  return (
    // tidak ada py default; biarkan parent yang atur via className
    <section className={clsx(className)}>
      <Container>
        <div className="w-full">
          <div className="aspect-video w-full overflow-hidden">
            <iframe
              className="h-full w-full"
              src={videoSrc}
              title="Homepage video"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
