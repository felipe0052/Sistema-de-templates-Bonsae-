"use client"

import { useState, useEffect } from "react"
import type { Template, Documento, Variavel, Cliente } from "@/lib/types"

const API_BASE_URL = "http://localhost:8000/api"

export function useApiStore() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [variaveis, setVariaveis] = useState<Variavel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@instituicao.com", password: "password" }),
        })
        const data = await response.json()
        if (data.access_token) {
          setToken(data.access_token)
        } else {
          console.error("Token not found in response", data)
          setIsLoading(false) // Stop loading if failed
        }
      } catch (error) {
        console.error("Login failed", error)
        setIsLoading(false) // Stop loading if failed
      }
    }
    login()
  }, [])

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [templatesRes, variablesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/templates`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/variables`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const templatesData = await templatesRes.json()
        const variablesData = await variablesRes.json()

        // Map backend templates to frontend Template type
        const mappedTemplates: Template[] = (templatesData.data || []).map((t: any) => ({
          id: String(t.id),
          nome_template: t.title,
          conteudo: t.content,
          categoria: t.metadata?.categoria || "Geral",
          cliente_id: String(t.tenant_id || "1"), // Adicionado cliente_id
          created_at: t.created_at,
          updated_at: t.updated_at,
          background_image_url: t.background_image_url,
        }))
        
        setTemplates(mappedTemplates)

        const mappedVariables: Variavel[] = variablesData.available_variables.map((v: string, index: number) => ({
          id: String(index + 1),
          nome_variavel: v,
          descricao: `Variável ${v}`,
          exemplo: `Exemplo ${v}`,
        }))
        setVariaveis(mappedVariables)

        // Mock data for things not yet in backend
        setClientes([
          { id: "1", nome: "João Silva", email: "joao@email.com", empresa: "Empresa ABC", created_at: new Date().toISOString() },
        ])
        setDocumentos([])
      } catch (error) {
        console.error("Fetch data failed", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const addTemplate = async (template: Omit<Template, "id" | "created_at" | "updated_at">) => {
    if (!token) return
    try {
      const response = await fetch(`${API_BASE_URL}/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: template.nome_template,
          content: template.conteudo,
          visibility: 'public',
          metadata: { categoria: template.categoria }
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Backend error:", errorData)
        throw new Error(errorData.message || "Failed to add template")
      }

      const data = await response.json()
      const newTemplate: Template = {
        id: String(data.id),
        nome_template: data.title,
        conteudo: data.content,
        categoria: data.metadata?.categoria || "Geral",
        cliente_id: String(data.tenant_id || "1"), // Adicionado cliente_id
        created_at: data.created_at,
        updated_at: data.updated_at,
        background_image_url: data.background_image_url,
      }
      setTemplates((prev) => [...prev, newTemplate])
      return newTemplate
    } catch (error) {
      console.error("Add template failed", error)
      throw error
    }
  }

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    if (!token) return
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updates.nome_template,
          content: updates.conteudo,
          metadata: updates.categoria ? { categoria: updates.categoria } : undefined
        }),
      })
      const data = await response.json()
      const updatedTemplate: Template = {
        id: String(data.id),
        nome_template: data.title,
        conteudo: data.content,
        categoria: data.metadata?.categoria || "Geral",
        cliente_id: String(data.tenant_id || "1"), // Adicionado cliente_id
        created_at: data.created_at,
        updated_at: data.updated_at,
        background_image_url: data.background_image_url,
      }
      setTemplates((prev) => prev.map((t) => (t.id === id ? updatedTemplate : t)))
    } catch (error) {
      console.error("Update template failed", error)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (!token) return
    try {
      await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Delete template failed", error)
    }
  }

  const renderTemplate = async (templateId: string, variables: Record<string, string>, behavior: 'blank' | 'underline' = 'blank') => {
    if (!token) return
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${templateId}/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variables,
          missing_variable_behavior: behavior,
          format: 'html'
        }),
      })
      const data = await response.json()
      return data.html
    } catch (error) {
      console.error("Render failed", error)
      return null
    }
  }

  // Other actions as mocks to maintain compatibility
  const addDocumento = (doc: any) => { console.log("Mock: addDocumento", doc) }
  const deleteDocumento = (id: string) => { console.log("Mock: deleteDocumento", id) }
  const addVariavel = (v: any) => { console.log("Mock: addVariavel", v) }
  const deleteVariavel = (id: string) => { console.log("Mock: deleteVariavel", id) }
  const addCliente = (c: any) => { console.log("Mock: addCliente", c) }

  return {
    templates,
    documentos,
    variaveis,
    clientes,
    isLoading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    renderTemplate,
    addDocumento,
    deleteDocumento,
    addVariavel,
    deleteVariavel,
    addCliente,
  }
}
