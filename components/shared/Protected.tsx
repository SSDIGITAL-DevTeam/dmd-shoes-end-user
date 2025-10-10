"use client";

import { PropsWithChildren, useEffect, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type ProtectedProps = PropsWithChildren<{
  locale: string;
  fallback?: ReactNode;
}>;

export function Protected({ children, locale, fallback }: ProtectedProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthed, isReady, isFetchingUser } = useAuth();

  useEffect(() => {
    if (!isReady || isFetchingUser) return;

    if (!isAuthed) {
      const search = searchParams?.toString();
      const current = search ? `${pathname}?${search}` : pathname;
      const nextParam = encodeURIComponent(current ?? "/");
      router.replace(`/${locale}/login?next=${nextParam}`);
    }
  }, [isReady, isAuthed, isFetchingUser, pathname, router, searchParams, locale]);

  if (!isReady || isFetchingUser) {
    return (
      fallback ?? (
        <div className="py-16 text-center text-sm text-gray-500">
          Memuat akun...
        </div>
      )
    );
  }

  if (!isAuthed) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
