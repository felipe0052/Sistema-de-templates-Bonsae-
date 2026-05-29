"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiFetch, getApiBaseUrl, mapApiVariable } from "@/lib/api-client"
import { availableVariables as fallbackVariables } from "@/lib/store"
import type { Assisted, Client, Document, StaticVariableApiResponse, Template, Variable } from "@/lib/types"

const AUTH_TOKEN_KEY = "bonsae_auth_token"

type StoreContextType = {
  templates: Template[]
  documents: Document[]
  variables: Variable[]
  variableCatalogAvailable: boolean
  clients: Client[]
  assisteds: Assisted[]
  isLoading: boolean
  token: string | null
  setAuthToken: (value: string | null) => void
  clearAuthToken: () => void
  addTemplate: (template: Omit<Template, "id" | "created_at" | "updated_at">) => Promise<Template>
  updateTemplate: (id: string, updates: Partial<Template>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  addDocument: (doc: Omit<Document, "id" | "created_at">) => Promise<Document | undefined>
  deleteDocument: (id: string) => Promise<void>
  renderTemplate: (
    templateId: string,
    vars: Record<string, string>,
    behavior?: "blank" | "underline",
  ) => Promise<string | null>
  renderTemplatePdf: (
    templateId: string,
    vars: Record<string, string>,
    behavior?: "blank" | "underline",
  ) => Promise<Blob | null>
  addVariable: (variable: Omit<Variable, "id">) => Promise<Variable>
  updateVariable: (id: string, variable: Omit<Variable, "id">) => Promise<Variable>
  deleteVariable: (id: string) => Promise<void>
  fetchAssisteds: (search?: string) => Promise<void>
  addClient: (_client: Omit<Client, "id" | "created_at">) => void
}

const AuthContext = createContext<{
  token: string | null
  setAuthToken: (value: string | null) => void
  clearAuthToken: () => void
} | null>(null)

const StoreContext = createContext<StoreContextType | undefined>(undefined)

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

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null
    }

    return localStorage.getItem(AUTH_TOKEN_KEY)
  })

  const setAuthToken = useCallback((value: string | null) => {
    setTokenState(value)

    if (typeof window === "undefined") {
      return
    }

    if (value) {
      localStorage.setItem(AUTH_TOKEN_KEY, value)
      return
    }

    localStorage.removeItem(AUTH_TOKEN_KEY)
  }, [])

  const clearAuthToken = useCallback(() => {
    setAuthToken(null)
  }, [setAuthToken])

  return <AuthContext.Provider value={{ token, setAuthToken, clearAuthToken }}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

function StoreDataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { token, setAuthToken, clearAuthToken } = useAuth()
  const [assistedsSearch, setAssistedsSearch] = useState<string | undefined>(undefined)

  const variablesQuery = useQuery({
    queryKey: ["variables"],
    queryFn: async (): Promise<{ items: Variable[]; available: boolean }> => {
      try {
        const variablesData = await apiFetch<{ data?: StaticVariableApiResponse[] }>("/variables")
        return {
          items: (variablesData.data || []).map(mapApiVariable),
          available: true,
        }
      } catch (error) {
        console.warn("Variables sync skipped:", error)
        return {
          items: fallbackVariables,
          available: false,
        }
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const templatesQuery = useQuery({
    queryKey: ["templates", token],
    queryFn: async () => {
      const templatesData = await apiFetch<{ data?: any[] }>("/templates", { token })
      return (templatesData.data || []).map(mapTemplate)
    },
    enabled: !!token,
  })

  const documentsQuery = useQuery({
    queryKey: ["documents", token],
    queryFn: async () => {
      const documentsData = await apiFetch<{ data?: any[] }>("/documents", { token })
      return (documentsData.data || []).map(mapDocument)
    },
    enabled: !!token,
  })

  const assistedsQuery = useQuery({
    queryKey: ["assisteds", token, assistedsSearch || ""],
    queryFn: async () => {
      const query = assistedsSearch ? `?search=${encodeURIComponent(assistedsSearch)}` : ""
      const assistedsData = await apiFetch<{ data?: any[] }>(`/assisteds${query}`, { token })
      return (assistedsData.data || []).map(mapAssisted)
    },
    enabled: !!token,
  })

  const addTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, "id" | "created_at" | "updated_at">) => {
      if (!token) {
        throw new Error("Autenticação necessária para criar template.")
      }

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
    onSuccess: (created) => {
      queryClient.setQueryData<Template[]>(["templates", token], (prev = []) => [created, ...prev])
    },
  })

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Template> }) => {
      if (!token) {
        throw new Error("Autenticação necessária para editar template.")
      }

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
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Template[]>(["templates", token], (prev = []) =>
        prev.map((item) => (item.id === variables.id ? { ...item, ...variables.updates } : item)),
      )
    },
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Autenticação necessária para excluir template.")
      }

      await apiFetch(`/templates/${id}`, {
        method: "DELETE",
        token,
      })
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Template[]>(["templates", token], (prev = []) => prev.filter((item) => item.id !== id))
    },
  })

  const addDocumentMutation = useMutation({
    mutationFn: async (doc: Omit<Document, "id" | "created_at">) => {
      if (!token) {
        throw new Error("Autenticação necessária para salvar documento.")
      }

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
      queryClient.setQueryData<Document[]>(["documents", token], (prev = []) => [created, ...prev])
    },
  })

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Autenticação necessária para excluir documento.")
      }

      await apiFetch(`/documents/${id}`, {
        method: "DELETE",
        token,
      })
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Document[]>(["documents", token], (prev = []) => prev.filter((item) => item.id !== id))
    },
  })

  const addVariableMutation = useMutation({
    mutationFn: async (variable: Omit<Variable, "id">) => {
      if (!token) {
        throw new Error("Autenticação necessária para criar variáveis.")
      }

      const data = await apiFetch<StaticVariableApiResponse>("/variables", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: variable.variable_name.trim().toLowerCase(),
          description: variable.description.trim(),
          example: variable.example?.trim() || undefined,
        }),
      })

      return mapApiVariable(data)
    },
    onSuccess: (created) => {
      queryClient.setQueryData<{ items: Variable[]; available: boolean }>(["variables"], (prev) => {
        const current = prev?.items || fallbackVariables
        return {
          items: [...current, created].sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
          available: true,
        }
      })
    },
  })

  const updateVariableMutation = useMutation({
    mutationFn: async ({ id, variable }: { id: string; variable: Omit<Variable, "id"> }) => {
      if (!token) {
        throw new Error("Autenticação necessária para editar variáveis.")
      }

      const data = await apiFetch<StaticVariableApiResponse>(`/variables/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: variable.variable_name.trim().toLowerCase(),
          description: variable.description.trim(),
          example: variable.example?.trim() || undefined,
        }),
      })

      return mapApiVariable(data)
    },
    onSuccess: (updated, variables) => {
      queryClient.setQueryData<{ items: Variable[]; available: boolean }>(["variables"], (prev) => {
        const current = prev?.items || fallbackVariables
        return {
          items: current
            .map((item) => (item.id === variables.id ? updated : item))
            .sort((a, b) => a.variable_name.localeCompare(b.variable_name)),
          available: true,
        }
      })
    },
  })

  const deleteVariableMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Autenticação necessária para excluir variáveis.")
      }

      await apiFetch(`/variables/${id}`, {
        method: "DELETE",
        token,
      })
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<{ items: Variable[]; available: boolean }>(["variables"], (prev) => {
        const current = prev?.items || fallbackVariables
        return {
          items: current.filter((item) => item.id !== id),
          available: true,
        }
      })
    },
  })

  const renderTemplate = useCallback(
    async (templateId: string, vars: Record<string, string>, behavior: "blank" | "underline" = "blank") => {
      if (!token) {
        return null
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/templates/${templateId}/render`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            variables: vars,
            missing_variable_behavior: behavior,
            format: "html",
          }),
        })

        if (!response.ok) {
          return null
        }

        const data = await response.json()
        return data.html || null
      } catch {
        return null
      }
    },
    [token],
  )

  const renderTemplatePdf = useCallback(
    async (templateId: string, vars: Record<string, string>, behavior: "blank" | "underline" = "blank") => {
      if (!token) {
        return null
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/templates/${templateId}/render`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf, application/json",
          },
          body: JSON.stringify({
            variables: vars,
            missing_variable_behavior: behavior,
            format: "pdf",
          }),
        })

        if (!response.ok) {
          return null
        }

        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/pdf")) {
          return await response.blob()
        }

        const data = await response.json().catch(() => null)
        if (data?.html) {
          return new Blob([data.html], { type: "text/html;charset=utf-8" })
        }

        return null
      } catch {
        return null
      }
    },
    [token],
  )

  const fetchAssisteds = useCallback(
    async (search?: string) => {
      setAssistedsSearch(search?.trim() || undefined)
    },
    [setAssistedsSearch],
  )

  const handleClearAuthToken = useCallback(() => {
    clearAuthToken()
    queryClient.clear()
  }, [clearAuthToken, queryClient])

  const contextValue = useMemo<StoreContextType>(
    () => ({
      templates: templatesQuery.data || [],
      documents: documentsQuery.data || [],
      variables: variablesQuery.data?.items || fallbackVariables,
      variableCatalogAvailable: variablesQuery.data?.available ?? false,
      clients: (assistedsQuery.data || []).map(mapClient),
      assisteds: assistedsQuery.data || [],
      isLoading:
        variablesQuery.isLoading ||
        (!!token && (templatesQuery.isLoading || documentsQuery.isLoading || assistedsQuery.isLoading)),
      token,
      setAuthToken,
      clearAuthToken: handleClearAuthToken,
      addTemplate: addTemplateMutation.mutateAsync,
      updateTemplate: async (id: string, updates: Partial<Template>) => {
        await updateTemplateMutation.mutateAsync({ id, updates })
      },
      deleteTemplate: async (id: string) => {
        await deleteTemplateMutation.mutateAsync(id)
      },
      addDocument: addDocumentMutation.mutateAsync,
      deleteDocument: async (id: string) => {
        await deleteDocumentMutation.mutateAsync(id)
      },
      renderTemplate,
      renderTemplatePdf,
      addVariable: addVariableMutation.mutateAsync,
      updateVariable: async (id: string, variable: Omit<Variable, "id">) => {
        return await updateVariableMutation.mutateAsync({ id, variable })
      },
      deleteVariable: async (id: string) => {
        await deleteVariableMutation.mutateAsync(id)
      },
      fetchAssisteds,
      addClient: () => {},
    }),
    [
      templatesQuery.data,
      documentsQuery.data,
      variablesQuery.data,
      variablesQuery.isLoading,
      assistedsQuery.data,
      assistedsQuery.isLoading,
      templatesQuery.isLoading,
      documentsQuery.isLoading,
      token,
      setAuthToken,
      handleClearAuthToken,
      addTemplateMutation.mutateAsync,
      updateTemplateMutation.mutateAsync,
      deleteTemplateMutation.mutateAsync,
      addDocumentMutation.mutateAsync,
      deleteDocumentMutation.mutateAsync,
      renderTemplate,
      renderTemplatePdf,
      addVariableMutation.mutateAsync,
      updateVariableMutation.mutateAsync,
      deleteVariableMutation.mutateAsync,
      fetchAssisteds,
    ],
  )

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreDataProvider>{children}</StoreDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
