"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import { useAuth } from "./use-auth"

interface TypeDocument {
  id: string
  name: string
}

const FALLBACK_TYPE_DOCUMENTS: TypeDocument[] = [
  { id: "fallback-1", name: "Declarações" },
  { id: "fallback-2", name: "Comprovantes" },
  { id: "fallback-3", name: "Autorizações" },
  { id: "fallback-4", name: "Contratos" },
  { id: "fallback-5", name: "Relatórios" },
  { id: "fallback-6", name: "Outros" },
]

const queryKey = ["type-documents"] as const

export function useTypeDocuments() {
  const { token } = useAuth()

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<TypeDocument[]> => {
      try {
        const data = await apiFetch<{ data?: Array<{ id: number; name: string }> }>("/type-documents")
        const result = (data.data || []).map((t) => ({
          id: String(t.id),
          name: t.name,
        }))
        return result.length > 0 ? result : FALLBACK_TYPE_DOCUMENTS
      } catch (error) {
        console.warn("Type documents fetch failed:", error)
        return FALLBACK_TYPE_DOCUMENTS
      }
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!token,
  })

  return {
    typeDocuments: query.data || FALLBACK_TYPE_DOCUMENTS,
    isLoading: query.isLoading,
  }
}
