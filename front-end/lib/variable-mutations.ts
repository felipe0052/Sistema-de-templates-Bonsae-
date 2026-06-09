import { type QueryClient } from "@tanstack/react-query"
import { availableVariables as fallbackVariables } from "@/lib/store"
import type { Variable } from "@/lib/types"

export type VariablesData = { items: Variable[]; available: boolean }
const queryKey = ["variables"] as const

export function optimisticAdd(queryClient: QueryClient, created: Variable) {
  const previous = queryClient.getQueryData<VariablesData>(queryKey)
  queryClient.setQueryData<VariablesData>(queryKey, (prev) => {
    const current = prev?.items || fallbackVariables
    return {
      items: [...current, created].sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
      available: true,
    }
  })
  return { previous }
}

export function optimisticUpdate(queryClient: QueryClient, id: string, variable: Omit<Variable, "id">) {
  const previous = queryClient.getQueryData<VariablesData>(queryKey)
  queryClient.setQueryData<VariablesData>(queryKey, (prev) => {
    const current = prev?.items || fallbackVariables
    return {
      items: current
        .map((item) => (item.id === id ? { id, ...variable } : item))
        .sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
      available: true,
    }
  })
  return { previous }
}

export function optimisticDelete(queryClient: QueryClient, id: string) {
  const previous = queryClient.getQueryData<VariablesData>(queryKey)
  queryClient.setQueryData<VariablesData>(queryKey, (prev) => {
    const current = prev?.items || fallbackVariables
    return {
      items: current.filter((item) => item.id !== id),
      available: true,
    }
  })
  return { previous }
}

export function rollback(queryClient: QueryClient, previous: VariablesData | undefined) {
  if (previous) queryClient.setQueryData(queryKey, previous)
}

export function invalidateVariables(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey })
}
