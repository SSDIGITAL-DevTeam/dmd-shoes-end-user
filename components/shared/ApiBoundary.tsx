"use client";

import type { ReactNode } from "react";

type ApiBoundaryProps = {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  skeleton?: ReactNode;
  empty?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
};

const defaultErrorMessage = "Terjadi kesalahan saat memuat data.";

export function ApiBoundary({
  isLoading,
  isError,
  error,
  isEmpty,
  skeleton,
  empty,
  onRetry,
  children,
}: ApiBoundaryProps) {
  if (isLoading) {
    return (
      <div data-testid="api-boundary-loading">
        {skeleton ?? (
          <div className="animate-pulse rounded-md bg-gray-100 p-6 text-sm text-gray-500">
            Memuat data...
          </div>
        )}
      </div>
    );
  }

  if (isError) {
    const message =
      (error instanceof Error && error.message) || defaultErrorMessage;

    return (
      <div
        data-testid="api-boundary-error"
        className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700"
      >
        <p className="font-semibold">Oops!</p>
        <p className="mt-1 text-sm">{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Coba lagi
          </button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        data-testid="api-boundary-empty"
        className="rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500"
      >
        {empty ?? <span>Data belum tersedia.</span>}
      </div>
    );
  }

  return <>{children}</>;
}
