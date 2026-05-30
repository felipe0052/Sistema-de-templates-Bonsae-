"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { Template } from "@/lib/types"
import { useAuth } from "./use-auth"

function mapTemplate(template: any): Template {
  return {
    id: String(template.id),
    template_name: template.title ?? template.template_name ?? "",
    content: template.content ?? "",
    category: template.metadata?.category ?? template.category ?? "General",
    client_id: String(template.tenant_id ?? template.client_id ?? "1"),
    created_at: template.created_at ?? new Date().toISOString(),
    updated_at: template.updated_at ?? new Date().toISOString(),
    background_image: template.background_image_url ?? template.background_image,
  }
}

function useTemplateQueryKey(token: string | null) {
  return ["templates", token] as const
}

export function useTemplates() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const queryKey = useTemplateQueryKey(token)

  const templatesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const templatesData = await apiFetch<{ data?: any[] }>("/templates", { token })
      return (templatesData.data || []).map(mapTemplate)
    },
    enabled: !!token,
  })

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
    onError: (_err, _template, _context) => {
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
          background_image_url: updates.background_image,
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
    templates: templatesQuery.data || [],
    isLoading: !!token && templatesQuery.isLoading,
    addTemplate: addTemplateMutation.mutateAsync,
    updateTemplate: async (id: string, updates: Partial<Template>) => {
      await updateTemplateMutation.mutateAsync({ id, updates })
    },
    deleteTemplate: async (id: string) => {
      await deleteTemplateMutation.mutateAsync(id)
    },
  }
}
