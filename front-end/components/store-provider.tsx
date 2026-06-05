"use client"

import React, { useState, useEffect, useRef } from "react"
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"
import { AuthProvider, useAuth } from "@/hooks/use-auth"

function CacheManager() {
  const queryClient = useQueryClient()
  const { token } = useAuth()
  const prevTokenRef = useRef(token)

  useEffect(() => {
    if (prevTokenRef.current !== null && token !== prevTokenRef.current) {
      queryClient.clear()
    }
    prevTokenRef.current = token
  }, [token, queryClient])

  return null
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CacheManager />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}
