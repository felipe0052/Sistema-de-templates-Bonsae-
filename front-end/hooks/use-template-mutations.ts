"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { Template } from "@/lib/types"
import { useAuth } from "./use-auth"
import { queryKey, mapTemplate, serializeBackgroundImage } from "./template-utils"

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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Template[]>(queryKey, (prev = []) => [created, ...prev])
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey })
    },
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
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Template[]>(queryKey)
      queryClient.setQueryData<Template[]>(queryKey, (prev = []) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      )
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

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Autenticação necessária para excluir template.")
      await apiFetch(`/templates/${id}`, { method: "DELETE", token })
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Template[]>(queryKey)
      queryClient.setQueryData<Template[]>(queryKey, (prev = []) => prev.filter((item) => item.id !== id))
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
    addTemplate: addTemplateMutation.mutateAsync,
    updateTemplate: async (id: string, updates: Partial<Template>) => {
      await updateTemplateMutation.mutateAsync({ id, updates })
    },
    deleteTemplate: async (id: string) => {
      await deleteTemplateMutation.mutateAsync(id)
    },
  }
}
