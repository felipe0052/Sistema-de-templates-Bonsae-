"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { Template } from "@/lib/types"
import { useAuth } from "./use-auth"
import { queryKey, mapTemplate, serializeBackgroundImage } from "./template-utils"
import { createOptimisticDelete, createOptimisticUpdate, createOptimisticCreate } from "./mutation-utils"

export function useTemplateMutations() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  const addTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, "id" | "created_at" | "updated_at">) => {
      if (!token) throw new Error("Autenticação necessária para criar template.")
      const data = await apiFetch<any>("/templates", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: template.template_name,
          content: template.content,
          visibility: "public",
          metadata: { category: template.category },
          background_image_url: serializeBackgroundImage(template.background_image),
        }),
      })
      return mapTemplate(data.data ?? data)
    },
    ...createOptimisticCreate<Template>(queryClient, queryKey),
  })

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Template> }) => {
      if (!token) throw new Error("Autenticação necessária para editar template.")
      await apiFetch(`/templates/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          title: updates.template_name,
          content: updates.content,
          metadata: updates.category ? { category: updates.category } : undefined,
          background_image_url: serializeBackgroundImage(updates.background_image),
        }),
      })
    },
    ...createOptimisticUpdate<Template>(queryClient, queryKey),
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Autenticação necessária para excluir template.")
      await apiFetch(`/templates/${id}`, { method: "DELETE", token })
    },
    ...createOptimisticDelete<Template>(queryClient, queryKey),
  })

  return {
    addTemplate: addTemplateMutation.mutateAsync,
    updateTemplate: async (id: string, updates: Partial<Template>) => {
      await updateTemplateMutation.mutateAsync({ id, updates })
    },
    deleteTemplate: async (id: string) => {
      await deleteTemplateMutation.mutateAsync(id)
    },
  }
}
