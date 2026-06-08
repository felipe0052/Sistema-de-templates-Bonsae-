"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch, mapApiVariable } from "@/lib/api-client"
import { optimisticAdd, optimisticUpdate, optimisticDelete, rollback, invalidateVariables } from "@/lib/variable-mutations"
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
    enabled: !!token,
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
    onMutate: async (variable) => {
      await queryClient.cancelQueries({ queryKey })
      const optimistic: Variable = {
        id: `temp-${Date.now()}`,
        variable_name: variable.variable_name.trim().toLowerCase(),
        description: variable.description.trim(),
        example: variable.example?.trim() || undefined,
      }
      return optimisticAdd(queryClient, optimistic)
    },
    onError: (_err, _variable, context) => {
      rollback(queryClient, context?.previous)
    },
    onSettled: () => {
      invalidateVariables(queryClient)
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
      return optimisticUpdate(queryClient, id, variable)
    },
    onError: (_err, _variables, context) => {
      rollback(queryClient, context?.previous)
    },
    onSettled: () => {
      invalidateVariables(queryClient)
    },
  })

  const deleteVariableMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Autenticação necessária para excluir variáveis.")
      await apiFetch(`/variables/${id}`, { method: "DELETE", token })
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      return optimisticDelete(queryClient, id)
    },
    onError: (_err, _id, context) => {
      rollback(queryClient, context?.previous)
    },
    onSettled: () => {
      invalidateVariables(queryClient)
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
