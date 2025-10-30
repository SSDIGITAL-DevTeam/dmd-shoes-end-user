"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

type LiteYouTubeEmbedProps = {
  videoId: string;
  title?: string;
  posterUrl?: string | null;
  className?: string;
  playLabel?: string;
};

const buildPosterUrl = (videoId: string, customPoster?: string | null) => {
  if (customPoster && customPoster.trim().length > 0) return customPoster;
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};

const buildEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;

export default function LiteYouTubeEmbed({
  videoId,
  title = "YouTube video player",
  posterUrl,
  className,
  playLabel = "Putar video",
}: LiteYouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const poster = useMemo(() => buildPosterUrl(videoId, posterUrl), [videoId, posterUrl]);
  const embedUrl = useMemo(() => buildEmbedUrl(videoId), [videoId]);

  return (
    <div
      className={clsx(
        "relative aspect-video w-full overflow-hidden rounded-lg bg-black/10",
        "shadow-sm ring-1 ring-black/5 transition",
        className,
      )}
    >
      {isPlaying ? (
        <iframe
          className="h-full w-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group relative h-full w-full cursor-pointer focus:outline-none"
          aria-label={playLabel}
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 900px, 1200px"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={false}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent transition duration-300 group-hover:from-black/55"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg transition duration-300 group-hover:bg-white"
          >
            <svg
              width="28"
              height="32"
              viewBox="0 0 28 32"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0.5V31.5L28 16L0 0.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
