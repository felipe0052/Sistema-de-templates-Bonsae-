"use client"

import { type QueryClient } from "@tanstack/react-query"

interface HasId {
  id: string
}

export function createOptimisticDelete<T extends HasId>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) {
  return {
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<T[]>(queryKey)
      queryClient.setQueryData<T[]>(queryKey, (prev = []) =>
        prev.filter((item) => item.id !== id),
      )
      return { previous }
    },
    onError: (_err: unknown, _id: string, context: { previous?: T[] } | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  }
}

export function createOptimisticUpdate<T extends HasId>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) {
  return {
    onMutate: async ({ id, updates }: { id: string; updates: Partial<T> }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<T[]>(queryKey)
      queryClient.setQueryData<T[]>(queryKey, (prev = []) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      )
      return { previous }
    },
    onError: (_err: unknown, _variables: unknown, context: { previous?: T[] } | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  }
}

export function createOptimisticCreate<T>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) {
  return {
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
    },
    onSuccess: (created: T) => {
      queryClient.setQueryData<T[]>(queryKey, (prev = []) => [created, ...prev])
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  }
}
