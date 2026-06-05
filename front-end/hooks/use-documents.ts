"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { Document } from "@/lib/types"
import { useAuth } from "./use-auth"

const queryKey = ["documents"] as const

function mapDocument(document: any): Document {
  return {
    id: String(document.id),
    template_id: String(document.template_id),
    name: document.name,
    data_json: document.data_json,
    pdf_generated: document.pdf_generated,
    created_at: document.created_at,
  }
}

export function useDocuments() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  const documentsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const documentsData = await apiFetch<{ data?: any[] }>("/documents", { token })
      return (documentsData.data || []).map(mapDocument)
    },
    enabled: !!token,
    staleTime: 30_000,
  })

  const addDocumentMutation = useMutation({
    mutationFn: async (doc: Omit<Document, "id" | "created_at">) => {
      if (!token) throw new Error("Autenticação necessária para salvar documento.")
      const data = await apiFetch<any>("/documents", {
        method: "POST",
        token,
        body: JSON.stringify({
          template_id: doc.template_id,
          name: doc.name,
          data_json: doc.data_json,
        }),
      })
      return mapDocument(data.data ?? data)
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Document[]>(queryKey, (prev = []) => [created, ...prev])
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Autenticação necessária para excluir documento.")
      await apiFetch(`/documents/${id}`, { method: "DELETE", token })
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Document[]>(queryKey)
      queryClient.setQueryData<Document[]>(queryKey, (prev = []) => prev.filter((item) => item.id !== id))
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
    documents: documentsQuery.data || [],
    isLoading: !!token && documentsQuery.isLoading,
    addDocument: addDocumentMutation.mutateAsync,
    deleteDocument: async (id: string) => {
      await deleteDocumentMutation.mutateAsync(id)
    },
  }
}
