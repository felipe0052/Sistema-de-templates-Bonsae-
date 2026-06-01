"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import { useAuth } from "./use-auth"

export type User = {
  id: number
  name: string
  email: string
  preferences: {
    pdf_default_format?: string
    pdf_margin_top?: number
    pdf_margin_bottom?: number
    pdf_margin_left?: number
    pdf_margin_right?: number
  }
}

export function useUser() {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["user"],
    queryFn: () => apiFetch<User>("/user", { token }),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function useUserPreferences() {
  const { data: user } = useUser()
  return user?.preferences ?? {}
}

export function useUpdateUser() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<User>("/user", {
        method: "PUT",
        token,
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}
