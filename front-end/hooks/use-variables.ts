"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch, mapApiVariable } from "@/lib/api-client"
import { availableVariables as fallbackVariables } from "@/lib/store"
import type { StaticVariableApiResponse, Variable } from "@/lib/types"
import { useAuth } from "./use-auth"

const queryKey = ["variables"] as const

export function useVariables() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  const variablesQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<{ items: Variable[]; available: boolean }> => {
      try {
        const variablesData = await apiFetch<{ data?: StaticVariableApiResponse[] }>("/variables")
        return {
          items: (variablesData.data || []).map(mapApiVariable),
          available: true,
        }
      } catch (error) {
        console.warn("Variables sync skipped:", error)
        return {
          items: fallbackVariables,
          available: false,
        }
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const addVariableMutation = useMutation({
    mutationFn: async (variable: Omit<Variable, "id">) => {
      if (!token) throw new Error("Autenticação necessária para criar variáveis.")
      const data = await apiFetch<StaticVariableApiResponse>("/variables", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: variable.variable_name.trim().toLowerCase(),
          description: variable.description.trim(),
          example: variable.example?.trim() || undefined,
        }),
      })
      return mapApiVariable(data)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
    },
    onSuccess: (created) => {
      queryClient.setQueryData<{ items: Variable[]; available: boolean }>(queryKey, (prev) => {
        const current = prev?.items || fallbackVariables
        return {
          items: [...current, created].sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
          available: true,
        }
      })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const updateVariableMutation = useMutation({
    mutationFn: async ({ id, variable }: { id: string; variable: Omit<Variable, "id"> }) => {
      if (!token) throw new Error("Autenticação necessária para editar variáveis.")
      const data = await apiFetch<StaticVariableApiResponse>(`/variables/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: variable.variable_name.trim().toLowerCase(),
          description: variable.description.trim(),
          example: variable.example?.trim() || undefined,
        }),
      })
      return mapApiVariable(data)
    },
    onMutate: async ({ id, variable }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<{ items: Variable[]; available: boolean }>(queryKey)
      queryClient.setQueryData<{ items: Variable[]; available: boolean }>(queryKey, (prev) => {
        const current = prev?.items || fallbackVariables
        return {
          items: current
            .map((item) => (item.id === id ? { id, variable_name: variable.variable_name, description: variable.description, example: variable.example } : item))
            .sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
          available: true,
        }
      })
      return { previous }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteVariableMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Autenticação necessária para excluir variáveis.")
      await apiFetch(`/variables/${id}`, { method: "DELETE", token })
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<{ items: Variable[]; available: boolean }>(queryKey)
      queryClient.setQueryData<{ items: Variable[]; available: boolean }>(queryKey, (prev) => {
        const current = prev?.items || fallbackVariables
        return {
          items: current.filter((item) => item.id !== id),
          available: true,
        }
      })
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    variables: variablesQuery.data?.items || fallbackVariables,
    variableCatalogAvailable: variablesQuery.data?.available ?? false,
    isLoading: variablesQuery.isLoading,
    addVariable: addVariableMutation.mutateAsync,
    updateVariable: async (id: string, variable: Omit<Variable, "id">) => {
      return await updateVariableMutation.mutateAsync({ id, variable })
    },
    deleteVariable: async (id: string) => {
      await deleteVariableMutation.mutateAsync(id)
    },
  }
}
