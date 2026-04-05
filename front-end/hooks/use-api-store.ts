"use client"

import { useState, useEffect } from "react"
import type { Template, Documento, Variavel, Cliente } from "@/lib/types"

const API_BASE_URL = "http://127.0.0.1:8000/api"
const LOCAL_STORAGE_KEY = "bonsae_templates_local"

export function useApiStore() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [variaveis, setVariaveis] = useState<Variavel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // 1. Carregar do LocalStorage imediatamente para garantir que o usuário veja algo
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      setTemplates(JSON.parse(saved))
    }
  }, [])

  // 2. Login automático no background
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
        }
      } catch (error) {
        console.warn("API Login failed, using local mode only.")
      }
    }
    login()
  }, [])

  // 3. Sincronizar com o Banco de Dados (API) se disponível
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      
      try {
        const [templatesRes, variablesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/templates`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/variables`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
        ])

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json()
          const mappedTemplates: Template[] = (templatesData.data || []).map((t: any) => ({
            id: String(t.id),
            nome_template: t.title,
            conteudo: t.content,
            categoria: t.metadata?.categoria || "Geral",
            cliente_id: String(t.tenant_id || "1"),
            created_at: t.created_at,
            updated_at: t.updated_at,
            background_image_url: t.background_image_url,
          }))
          
          // Merge API templates with local ones (API wins for same ID)
          setTemplates(prev => {
            const merged = [...mappedTemplates]
            prev.forEach(p => {
              if (!merged.find(m => m.id === p.id)) merged.push(p)
            })
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged))
            return merged
          })
        }

        if (variablesRes.ok) {
          const variablesData = await variablesRes.json()
          const mappedVariables: Variavel[] = variablesData.available_variables.map((v: string, index: number) => ({
            id: String(index + 1),
            nome_variavel: v,
            descricao: `Variável ${v}`,
            exemplo: `Exemplo ${v}`,
          }))
          setVariaveis(mappedVariables)
        }
      } catch (error) {
        console.error("Sync failed")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  const addTemplate = async (template: Omit<Template, "id" | "created_at" | "updated_at">) => {
    // SALVAR NO FRONT-END PRIMEIRO (Imediato)
    const tempId = "temp_" + Math.random().toString(36).substr(2, 9)
    const newTemplate: Template = {
      ...template,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTemplates(prev => {
      const updated = [newTemplate, ...prev]
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    // TENTAR SALVAR NO BACK-END (Background)
    if (token) {
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
        
        if (response.ok) {
          const data = await response.json()
          // Atualizar o ID temporário pelo ID real do banco
          setTemplates(prev => {
            const updated = prev.map(t => t.id === tempId ? {
              ...t,
              id: String(data.id),
              cliente_id: String(data.tenant_id)
            } : t)
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
            return updated
          })
        }
      } catch (error) {
        console.error("Background sync failed, template remains local.")
      }
    }

    return newTemplate
  }

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    // Atualiza local primeiro
    setTemplates(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    // Tenta API
    if (token && !id.startsWith('temp_')) {
      try {
        await fetch(`${API_BASE_URL}/templates/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: updates.nome_template,
            content: updates.conteudo,
            metadata: updates.categoria ? { categoria: updates.categoria } : undefined
          }),
        })
      } catch (e) {}
    }
  }

  const deleteTemplate = async (id: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    if (token && !id.startsWith('temp_')) {
      try {
        await fetch(`${API_BASE_URL}/templates/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (e) {}
    }
  }

  const renderTemplate = async (templateId: string, variables: Record<string, string>, behavior: 'blank' | 'underline' = 'blank') => {
    if (token && !templateId.startsWith('temp_')) {
      try {
        const response = await fetch(`${API_BASE_URL}/templates/${templateId}/render`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ variables, missing_variable_behavior: behavior, format: 'html' }),
        })
        const data = await response.json()
        return data.html
      } catch (error) {
        return null
      }
    }
    return null
  }

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
    addDocumento: () => {},
    deleteDocumento: () => {},
    addVariavel: () => {},
    deleteVariavel: () => {},
    addCliente: () => {},
  }
}
