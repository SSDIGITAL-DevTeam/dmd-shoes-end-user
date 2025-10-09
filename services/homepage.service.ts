import { apiFetch } from "@/lib/api-client";
import type {
  ApiResponse,
  HomepageContent,
  HomepageHero,
  HomepageSlider,
  HomepageVideo,
} from "@/services/types";

type HomepageResponse = ApiResponse<HomepageContent>;
type HeroResponse = ApiResponse<HomepageHero>;
type VideoResponse = ApiResponse<HomepageVideo>;
type SliderResponse = ApiResponse<HomepageSlider[]>;

const getAll = async (): Promise<HomepageContent> => {
  const response = await apiFetch<HomepageResponse>("/homepage");
  return response.data ?? {};
};

const getHero = async (): Promise<HomepageHero | undefined> => {
  const response = await apiFetch<HeroResponse>("/homepage/hero");
  return response.data ?? undefined;
};

const getVideo = async (): Promise<HomepageVideo | undefined> => {
  const response = await apiFetch<VideoResponse>("/homepage/video");
  return response.data ?? undefined;
};

const getSliders = async (): Promise<HomepageSlider[]> => {
  const response = await apiFetch<SliderResponse>("/homepage/sliders");
  return Array.isArray(response.data) ? response.data : [];
};

export const HomepageService = {
  getAll,
  getHero,
  getVideo,
  getSliders,
};

export type HomepageServiceType = typeof HomepageService;
