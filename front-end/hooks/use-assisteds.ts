"use client"

import React, { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { Assisted, Client } from "@/lib/types"
import { useAuth } from "./use-auth"

function mapAssisted(assisted: any): Assisted {
  return {
    ...assisted,
    id: String(assisted.id),
    address: assisted.address
      ? {
          ...assisted.address,
          id: String(assisted.address.id),
        }
      : null,
  }
}

function mapClient(assisted: Assisted): Client {
  return {
    id: assisted.id,
    name: assisted.name,
    email: assisted.email || "",
    organization: "Assisted",
    created_at: assisted.created_at || new Date().toISOString(),
    address: assisted.address || null,
  }
}

export function useAssisteds() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const [search, setSearch] = React.useState<string | undefined>(undefined)
  const searchKey = search || ""

  const assistedsQuery = useQuery({
    queryKey: ["assisteds", searchKey] as const,
    queryFn: async () => {
      const query = search ? `?search=${encodeURIComponent(search)}` : ""
      const assistedsData = await apiFetch<{ data?: any[] }>(`/assisteds${query}`, { token })
      return (assistedsData.data || []).map(mapAssisted)
    },
    enabled: !!token,
    staleTime: 30_000,
  })

  const addAssistedMutation = useMutation({
    mutationFn: async (client: Omit<Client, "id" | "created_at">) => {
      if (!token) throw new Error("Autenticação necessária para criar assistido.")
      const data = await apiFetch<any>("/assisteds", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: client.name,
          email: client.email,
        }),
      })
      return mapAssisted(data.data ?? data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assisteds"] })
    },
  })

  const fetchAssisteds = useCallback(
    async (search?: string) => {
      setSearch(search?.trim() || undefined)
    },
    [],
  )

  const assisteds = assistedsQuery.data || []

  return {
    assisteds,
    clients: assisteds.map(mapClient),
    isLoading: !!token && assistedsQuery.isLoading,
    fetchAssisteds,
    addAssisted: addAssistedMutation.mutateAsync,
  }
}
