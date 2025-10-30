import clsx from "clsx";
import LiteYouTubeEmbed from "@/components/shared/LiteYouTubeEmbed";
import type { HomepageVideo } from "@/services/types";

type HomeVideoProps = {
  video?: HomepageVideo;
  className?: string;
};

const extractYouTubeId = (input?: string | null): string | null => {
  if (!input) return null;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }
    if (url.searchParams.has("v")) {
      return url.searchParams.get("v");
    }
    const segments = url.pathname.split("/").filter(Boolean);
    const embedIndex = segments.findIndex((segment) => segment === "embed");
    if (embedIndex !== -1 && segments[embedIndex + 1]) {
      return segments[embedIndex + 1];
    }
    if (segments.length) {
      return segments[segments.length - 1];
    }
  } catch {
    // ignore parse errors and fall through
  }
  // already an ID?
  return /^[\w-]{11}$/.test(input) ? input : null;
};

const buildVideoPoster = (video?: HomepageVideo) =>
  video?.cover_url && video.cover_url.trim().length > 0 ? video.cover_url : undefined;

export default function HomeVideo({ video, className }: HomeVideoProps) {
  const youTubeId =
    video?.mode === "youtube" ? extractYouTubeId(video.url ?? video.file_url ?? undefined) : null;
  const poster = buildVideoPoster(video);

  return (
    <section className={clsx(className)}>
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="aspect-video w-full">
          {youTubeId ? (
            <LiteYouTubeEmbed
              videoId={youTubeId}
              title="Homepage video"
              posterUrl={poster}
              playLabel="Putar video"
            />
          ) : video?.file_url ? (
            <video
              className="h-full w-full rounded-lg bg-black/5"
              controls
              preload="metadata"
              poster={poster}
            >
              <source src={video.file_url} />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-black/5 text-sm text-gray-500">
              Video belum tersedia.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
