"use client";

import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FavoriteService } from "@/services/favorite.service";
import type {
  FavoriteCheckoutPayload,
  FavoriteCheckoutResponse,
  FavoriteItem,
} from "@/services/types";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/hooks/useAuth";

type AddFavoritePayload = {
  productId: number;
  variantId?: number | null;
};

type RemoveFavoritePayload = {
  productId: number;
  variantId?: number | null;
};

export const useFavorites = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: queryKeys.favorites.list,
    queryFn: FavoriteService.list,
    enabled: !!token,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, variantId }: AddFavoritePayload) =>
      FavoriteService.add(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ productId, variantId }: RemoveFavoritePayload) =>
      FavoriteService.remove(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (payload?: FavoriteCheckoutPayload) =>
      FavoriteService.checkout(payload),
  });

  const favorites = useMemo<FavoriteItem[]>(
    () => favoritesQuery.data ?? [],
    [favoritesQuery.data],
  );

  return {
    favorites,
    isLoading: favoritesQuery.isLoading,
    isFetching: favoritesQuery.isFetching,
    isError: favoritesQuery.isError,
    error: favoritesQuery.error,
    refetch: favoritesQuery.refetch,
    addFavorite: (payload: AddFavoritePayload) => addMutation.mutateAsync(payload),
    removeFavorite: (payload: RemoveFavoritePayload) =>
      removeMutation.mutateAsync(payload),
    checkout: (payload?: FavoriteCheckoutPayload) =>
      checkoutMutation.mutateAsync(payload),
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isCheckingOut: checkoutMutation.isPending,
    lastCheckout: checkoutMutation.data as FavoriteCheckoutResponse | undefined,
    checkoutError: checkoutMutation.error,
  };
};
