"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import { useAuth } from "./use-auth"
import { queryKey, mapTemplate } from "./template-utils"
export { useTemplateMutations as useTemplatesMutations } from "./use-template-mutations"

export function useTemplates() {
  const { token } = useAuth()

  const templatesQuery = useQuery({
    staleTime: 30_000,
    queryKey,
    queryFn: async () => {
      const templatesData = await apiFetch<{ data?: any[] }>("/templates", { token })
      return (templatesData.data || []).map(mapTemplate)
    },
    enabled: !!token,
  })

  return {
    templates: templatesQuery.data || [],
    isLoading: !!token && templatesQuery.isLoading,
    isFetched: templatesQuery.isFetched,
  }
}
