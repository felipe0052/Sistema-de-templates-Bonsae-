"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import { useAuth } from "./use-auth"

interface TypeDocument {
  id: string
  name: string
}

const queryKey = ["type-documents"] as const

export function useTypeDocuments() {
  const { token } = useAuth()

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<TypeDocument[]> => {
      try {
        const data = await apiFetch<{ data?: Array<{ id: number; name: string }> }>("/type-documents")
        return (data.data || []).map((t) => ({
          id: String(t.id),
          name: t.name,
        }))
      } catch (error) {
        console.warn("Type documents fetch failed:", error)
        return []
      }
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!token,
  })

  return {
    typeDocuments: query.data || [],
    isLoading: query.isLoading,
  }
}
