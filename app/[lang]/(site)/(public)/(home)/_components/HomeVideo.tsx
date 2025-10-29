import clsx from "clsx";
import type { HomepageVideo } from "@/services/types";

type HomeVideoProps = {
  video?: HomepageVideo;
  className?: string;
};

const FALLBACK_YOUTUBE = "https://www.youtube.com/embed/5h6hI7PWdAk";

const toEmbedUrl = (url?: string | null) => {
  if (!url) return FALLBACK_YOUTUBE;
  if (url.includes("youtube.com") && url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  return url;
};

const resolveVideoSrc = (video?: HomepageVideo): string => {
  if (!video) return FALLBACK_YOUTUBE;
  if (video.mode === "youtube") {
    return toEmbedUrl(video.url);
  }
  if (video.file_url) {
    return video.file_url;
  }
  return FALLBACK_YOUTUBE;
};

export default function HomeVideo({ video, className }: HomeVideoProps) {
  const videoSrc = resolveVideoSrc(video);

  return (
    <section className={clsx(className)}>
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/5">
          <iframe
            className="h-full w-full"
            src={videoSrc}
            title="Homepage video"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
