"use client";

import { useQuery } from "@tanstack/react-query";
import { HomepageService } from "@/services/homepage.service";
import type { HomepageContent, HomepageSlider } from "@/services/types";
import { queryKeys } from "@/lib/query-keys";

const groupSliders = (sliders: HomepageSlider[]) => {
  return sliders.reduce((acc, slider) => {
    const key = slider.group ?? "default";
    if (!acc[key]) acc[key] = [];
    acc[key].push(slider);
    acc[key].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
    return acc;
  }, {} as Record<string, HomepageSlider[]>);
};

const fetchHomepage = async (): Promise<HomepageContent> => {
  const base = await HomepageService.getAll();

  const hero = base.hero ?? (await HomepageService.getHero());
  const video = base.video ?? (await HomepageService.getVideo());

  const sliders = base.sliders ?? {};
  const hasSliders = Object.keys(sliders).length > 0;

  const sliderGroups = hasSliders
    ? Object.fromEntries(
        Object.entries(sliders).map(([group, items]) => [
          group,
          [...items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
        ]),
      )
    : groupSliders(await HomepageService.getSliders());

  return {
    ...base,
    hero: hero ?? undefined,
    video: video ?? undefined,
    sliders: sliderGroups,
  };
};

export const useHomepage = () => {
  const query = useQuery({
    queryKey: queryKeys.homepage,
    queryFn: fetchHomepage,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};


