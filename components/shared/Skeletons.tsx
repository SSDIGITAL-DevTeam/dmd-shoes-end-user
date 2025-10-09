"use client";

import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

const baseSkeletonClass =
  "animate-pulse rounded-md bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100";

export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx("space-y-3", className)}>
      <div className={clsx(baseSkeletonClass, "aspect-[3/4] w-full")} />
      <div className="space-y-2">
        <div className={clsx(baseSkeletonClass, "h-4 w-3/4")} />
        <div className={clsx(baseSkeletonClass, "h-3 w-1/2")} />
        <div className={clsx(baseSkeletonClass, "h-5 w-2/3")} />
      </div>
    </div>
  );
}

export function BannerSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        baseSkeletonClass,
        "h-48 w-full rounded-lg sm:h-64 lg:h-96",
        className,
      )}
    />
  );
}

export function SliderSkeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx("flex gap-4 overflow-hidden", className)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={clsx(baseSkeletonClass, "h-32 w-48 flex-shrink-0 rounded-lg")}
        />
      ))}
    </div>
  );
}

export function ListSkeleton({
  className,
  rows = 4,
}: SkeletonProps & { rows?: number }) {
  return (
    <div className={clsx("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={clsx(baseSkeletonClass, "h-4 w-full")} />
      ))}
    </div>
  );
}

export function TextSkeleton({ className }: SkeletonProps) {
  return <div className={clsx(baseSkeletonClass, "h-3 w-full", className)} />;
}

export function AvatarSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(baseSkeletonClass, "h-10 w-10 rounded-full", className)}
    />
  );
}
